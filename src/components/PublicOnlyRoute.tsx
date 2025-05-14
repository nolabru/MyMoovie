
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface PublicOnlyRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ 
  children, 
  redirectTo = "/home" 
}) => {
  const { user, loading } = useAuth();
  
  // Mostrar indicador de carregamento enquanto verifica autenticação
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Se o usuário estiver logado, redirecionar para a rota especificada
  if (user) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // Caso contrário, renderizar os filhos (tela de splash)
  return <>{children}</>;
};

export default PublicOnlyRoute;
