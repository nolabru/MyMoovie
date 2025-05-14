
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
    
    // Primeiro configuramos o listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state change:', event, newSession?.user?.email);
        
        if (!mounted) return;
        
        if (newSession) {
          setSession(newSession);
          setUser(newSession.user);
          
          // Use a separate function to avoid dependency cycles
          if (newSession.user) {
            // Invoke checkIsAdmin but don't wait for it in this callback
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

    // Depois verificamos a sessão atual
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Current session:', currentSession?.user?.email);
        
        if (!mounted) return;
        
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

  // Função para logout - Melhorada para lidar com sessões expiradas e loops
  const signOut = async () => {
    try {
      console.log("Iniciando processo de logout");
      
      // Limpar estados locais primeiro para evitar loops na UI
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      
      // Depois tentamos fazer logout na API
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        // Ignorar erros específicos de sessão que não afetam a experiência do usuário
        if (error.message.includes("Session not found")) {
          console.log("Sessão já expirada, continuando com logout local");
        } else {
          console.error("Erro durante logout:", error);
          throw error;
        }
      }
      
      toast.success("Logout realizado com sucesso!");
    } catch (error: any) {
      console.error("Erro durante logout:", error);
      toast.error(error.message || "Erro ao fazer logout");
      // Não lançamos o erro de volta para permitir que a navegação continue
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
