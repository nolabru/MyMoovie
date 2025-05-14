
import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Usar useEffect para evitar renderizações múltiplas
    if (!loading) {
      if (user) {
        navigate("/home", { replace: true });
      } else {
        navigate("/apresentacao", { replace: true });
      }
    }
  }, [user, loading, navigate]);
  
  // Durante o carregamento, mostra um indicador
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  
  // Este return nunca deve ser atingido devido ao useEffect,
  // mas é necessário para satisfazer o TypeScript
  return null;
};

export default Index;
