import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Verificar se o usuário é administrador
  const checkIsAdmin = async (userId: string, userEmail: string | null | undefined) => {
    if (!userId) return false;
    
    try {
      // Primeiro verificamos se o email tem o sufixo @admin.com
      if (userEmail && userEmail.endsWith('@admin.com')) {
        setIsAdmin(true);
        return true;
      }
      
      // Se não for admin pelo email, verificamos na tabela de roles
      const { data, error } = await supabase
        .rpc('is_admin', { user_id: userId });
        
      if (error) throw error;
      setIsAdmin(!!data);
      return !!data;
    } catch (error) {
      console.error('Erro ao verificar função de administrador:', error);
      setIsAdmin(false);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;
    
    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event, newSession?.user?.email);
        
        if (newSession) {
          setSession(newSession);
          setUser(newSession.user);
          
          // Use setTimeout to avoid potential deadlocks with Supabase client
          if (newSession.user) {
            setTimeout(() => {
              if (mounted) checkIsAdmin(newSession.user.id, newSession.user.email);
            }, 0);
          }
        } else {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
        }
      }
    );

    // Then fetch the current session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        console.log('Current session:', currentSession?.user?.email);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          await checkIsAdmin(currentSession.user.id, currentSession.user.email);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Função para cadastro de usuários
  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      toast.success("Cadastro realizado! Verifique seu email para confirmar.");
    } catch (error: any) {
      toast.error(error.message || "Erro ao cadastrar usuário");
      throw error;
    }
  };

  // Função para login
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      toast.success("Login realizado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login");
      throw error;
    }
  };

  // Improved logout function with more robust error handling
  const signOut = async () => {
    try {
      console.log("Starting logout process");
      
      // Clear local state first to prevent UI loops
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      
      // Force clear local storage
      localStorage.removeItem('supabase.auth.token');
      
      // Then attempt API logout
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        if (error.message.includes("Session not found")) {
          console.log("Session already expired, continuing with local logout");
        } else {
          console.error("Error during logout:", error);
          throw error;
        }
      }
      
      toast.success("Logout realizado com sucesso!");
      
      // Force a reload to ensure clean state
      setTimeout(() => {
        window.location.href = '/apresentacao';
      }, 500);
      
    } catch (error: any) {
      console.error("Error during logout:", error);
      toast.error(error.message || "Erro ao fazer logout");
      
      // Even on error, redirect to ensure user can escape
      setTimeout(() => {
        window.location.href = '/apresentacao';
      }, 500);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        isAdmin,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
