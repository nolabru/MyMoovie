
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

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkIsAdmin(session.user.id);
      }
      
      setLoading(false);
    });

    // Configurar listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          checkIsAdmin(session.user.id);
        } else {
          setIsAdmin(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Verificar se o usuário é administrador
  const checkIsAdmin = async (userId: string) => {
    if (!userId) return;
    
    try {
      const email = user?.email || '';
      if (email.endsWith('@admin.com')) {
        setIsAdmin(true);
        return;
      }
      
      // Verificar na tabela user_roles se o usuário tem a role de admin
      const { data, error } = await supabase
        .rpc('is_admin', { user_id: userId });
        
      if (error) throw error;
      setIsAdmin(!!data);
    } catch (error) {
      console.error('Erro ao verificar função de administrador:', error);
      setIsAdmin(false);
    }
  };

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

  // Função para logout - melhorada para garantir limpeza correta do estado
  const signOut = async () => {
    try {
      console.log("Signing out user:", user?.email);
      const { error } = await supabase.auth.signOut();
      
      // Limpar estado local imediatamente, mesmo que haja erro no Supabase
      // Isso evita problemas com o loop de redirecionamento
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      
      if (error) {
        // Se o erro for "Session not found", podemos ignorar, pois já limpamos o estado
        if (!error.message.includes("Session not found")) {
          throw error;
        } else {
          console.log("Session not found, but continuing with local logout");
        }
      }
      
      toast.success("Logout realizado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer logout");
      // Mesmo com erro, garantimos que o estado local está limpo
      console.error("Logout error:", error);
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
