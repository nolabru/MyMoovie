
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, loading, isAdmin, adminLoading } = useAuth();
  const [isReady, setIsReady] = useState(false);
  
  // Aguardamos a conclusão da verificação de admin antes de redirecionar
  useEffect(() => {
    if (!loading && !adminLoading) {
      setIsReady(true);
    }
  }, [loading, adminLoading]);
  
  // Mostrar nada enquanto carrega para evitar redirecionamentos prematuros
  if (loading || adminLoading || !isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg">Carregando...</div>
      </div>
    );
  }
  
  // Se for admin, vai para o painel de admin, se for usuário normal vai para home, senão vai para apresentação
  if (user) {
    return isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/home" replace />;
  } else {
    return <Navigate to="/apresentacao" replace />;
  }
};

export default Index;
