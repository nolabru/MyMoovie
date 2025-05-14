
import React from "react";
import { Navigate } from "react-router-dom";
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
  
  // Se ainda estiver carregando os dados de autenticação, não mostra nada
  if (loading) return null;
  
  // Se o usuário não estiver logado ou não for admin, redireciona
  if (!user || !isAdmin) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // Se o usuário for admin, renderiza o conteúdo administrativo
  return <>{children}</>;
};

export default AdminRoute;
