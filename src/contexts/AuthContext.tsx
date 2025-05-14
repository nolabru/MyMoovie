
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
  const checkIsAdmin = async (userId: string, userEmail?: string | null) => {
    if (!userId) return;
    
    try {
      // Primeiro verificamos se o email tem o sufixo @admin.com
      // Usamos o email passado como parâmetro para evitar dependência do estado user
      const email = userEmail || '';
      if (email.endsWith('@admin.com')) {
        setIsAdmin(true);
        return;
      }
      
      // Se não for admin pelo email, verificamos na tabela de roles
      const { data, error } = await supabase
        .rpc('is_admin', { user_id: userId });
        
      if (error) throw error;
      setIsAdmin(!!data);
    } catch (error) {
      console.error('Erro ao verificar função de administrador:', error);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    // Primeiro configuramos o listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state change:', event, newSession?.user?.email);
        setSession(newSession);
        if (newSession?.user) {
          setUser(newSession.user);
          // Usamos setTimeout para evitar ciclos de dependência
          setTimeout(() => {
            checkIsAdmin(newSession.user.id, newSession.user.email);
          }, 0);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      }
    );

    // Depois verificamos a sessão atual
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Current session:', currentSession?.user?.email);
      setSession(currentSession);
      
      if (currentSession?.user) {
        setUser(currentSession.user);
        // Verificamos isAdmin depois de definir user e session
        checkIsAdmin(currentSession.user.id, currentSession.user.email);
      }
      
      setLoading(false);
    });

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
      toast.success("Login realizado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login");
      throw error;
    }
  };

  // Função para logout - Melhorada para lidar com sessões expiradas
  const signOut = async () => {
    try {
      // Mesmo se não houver sessão ativa, tentamos fazer logout para limpar qualquer estado
      const { error } = await supabase.auth.signOut();
      
      // Se houver erro mas for relacionado a sessão não encontrada, consideramos como sucesso
      if (error && !error.message.includes("Session not found")) {
        throw error;
      }
      
      // Limpar estados locais independentemente do resultado do signOut
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      
      toast.success("Logout realizado com sucesso!");
    } catch (error: any) {
      console.error("Erro durante logout:", error);
      toast.error(error.message || "Erro ao fazer logout");
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
