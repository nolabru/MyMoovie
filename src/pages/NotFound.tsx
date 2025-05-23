
import React from "react";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const NotFound: React.FC = () => {
  const { user, loading } = useAuth();
  
  // If still loading auth state, show nothing to prevent flash
  if (loading) return null;
  
  // If no user is logged in, redirect to presentation page
  if (!user) {
    return <Navigate to="/apresentacao" replace />;
  }
  
  // User is authenticated, show the not found page
  return (
    <div className="container flex flex-col items-center justify-center min-h-[80vh] text-center py-8 px-4">
      <h1 className="text-9xl font-bold text-screentrack-500">404</h1>
      <h2 className="text-3xl font-bold mt-4 mb-2">Página não encontrada</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        A página que você está procurando não existe ou foi removida.
      </p>
      <Button asChild>
        <Link to="/home">Voltar para a página inicial</Link>
      </Button>
    </div>
  );
};

export default NotFound;
