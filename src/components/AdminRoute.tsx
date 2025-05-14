
import React, { useEffect, useState } from "react";
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
  const [hasRedirected, setHasRedirected] = useState(false);
  
  useEffect(() => {
    // Redirecionamento apenas após carga completa dos dados de autenticação
    if (!loading && !hasRedirected) {
      if (!user || !isAdmin) {
        console.log("AdminRoute: User not admin, redirecting to", redirectTo);
        
        // Set the flag to prevent multiple redirects
        setHasRedirected(true);
        
        // Use a short timeout to ensure state is fully updated before navigation
        setTimeout(() => {
          navigate(redirectTo, { replace: true });
        }, 10);
      }
    }
  }, [user, isAdmin, loading, navigate, redirectTo, hasRedirected]);
  
  // Se ainda estiver carregando ou usuário não for admin, mostra carregamento
  if (loading || !user || !isAdmin || hasRedirected) {
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
