
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  adminLoading: boolean;
  checkAdminStatus: () => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyResetCode: (email: string, token: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminLoading, setAdminLoading] = useState<boolean>(false);

  // Função para verificar se o usuário é administrador
  const checkAdminStatus = async (): Promise<boolean> => {
    if (!user) return false;

    setAdminLoading(true);
    try {
      console.log("Verificando status de admin para:", user.email);
      
      // Verificar diretamente se o email termina com @admin.com
      const isUserAdmin = user.email ? user.email.endsWith('@admin.com') : false;
      
      console.log("É admin?", isUserAdmin);
      setIsAdmin(isUserAdmin);
      return isUserAdmin;
    } catch (error: any) {
      console.error("Erro ao verificar status de admin:", error.message);
      return false;
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    const setupAuth = async () => {
      try {
        // Verificar sessão atual
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        // Se o usuário estiver logado, verifica se é admin
        if (session?.user) {
          await checkAdminStatus();
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Erro ao inicializar autenticação:", error);
        setLoading(false);
      }
    };

    setupAuth();

    // Configurar listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        console.log("Estado de autenticação alterado:", !!session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Executamos o checkAdminStatus fora do callback principal
          // para evitar problemas com o SDK do Supabase
          setTimeout(async () => {
            await checkAdminStatus();
          }, 0);
        } else {
          setIsAdmin(false);
        }
      }
    );

    return () => subscription.unsubscribe();
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
      
      // Após fazer login, verificamos novamente o status de admin
      // Com um pequeno atraso para garantir que o estado de autenticação foi atualizado
      setTimeout(async () => {
        await checkAdminStatus();
      }, 100);
      
      toast.success("Login realizado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login");
      throw error;
    }
  };

  // Função para logout
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Logout realizado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer logout");
      throw error;
    }
  };

  // Função para solicitar redefinição de senha
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth?reset=true',
      });
      
      if (error) throw error;
      toast.success("Email de redefinição de senha enviado. Verifique sua caixa de entrada.");
    } catch (error: any) {
      toast.error(error.message || "Erro ao solicitar redefinição de senha");
      throw error;
    }
  };

  // Função para verificar o código de redefinição
  const verifyResetCode = async (email: string, token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'recovery',
      });
      
      if (error) throw error;
      toast.success("Código verificado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Código inválido ou expirado");
      throw error;
    }
  };

  // Função para atualizar a senha
  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) throw error;
      toast.success("Senha atualizada com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar senha");
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        isAdmin,
        adminLoading,
        checkAdminStatus,
        signUp,
        signIn,
        signOut,
        resetPassword,
        verifyResetCode,
        updatePassword,
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
