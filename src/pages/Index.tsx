
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, loading, isAdmin, adminLoading, checkAdminStatus } = useAuth();
  const [isReady, setIsReady] = useState(false);
  
  // Verificamos explicitamente o status de admin quando a página carrega
  useEffect(() => {
    const verifyAdmin = async () => {
      if (user && !adminLoading) {
        console.log("Index: Verificando status de admin para usuário:", user.email);
        await checkAdminStatus();
      }
      
      if (!loading && !adminLoading) {
        console.log("Index: Pronto para redirecionar. User:", !!user, "isAdmin:", isAdmin);
        setIsReady(true);
      }
    };
    
    verifyAdmin();
  }, [user, loading, adminLoading, checkAdminStatus, isAdmin]);
  
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
    console.log("Index: Redirecionando usuário. IsAdmin:", isAdmin);
    return isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/home" replace />;
  } else {
    return <Navigate to="/apresentacao" replace />;
  }
};

export default Index;
