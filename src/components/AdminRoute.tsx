
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AdminRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ 
  children, 
  redirectTo = "/" 
}) => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirecionamento apenas após carga completa dos dados de autenticação
    if (!loading) {
      if (!user || !isAdmin) {
        console.log("AdminRoute: User not admin, redirecting to", redirectTo);
        navigate(redirectTo, { replace: true });
      }
    }
  }, [user, isAdmin, loading, navigate, redirectTo]);
  
  // Se ainda estiver carregando ou usuário não for admin, mostra carregamento
  if (loading || !user || !isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }
  
  // Se o usuário for admin, renderiza o conteúdo administrativo
  return <>{children}</>;
};

export default AdminRoute;
