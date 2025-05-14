
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Only redirect when loading is complete to prevent redirect loops
    if (!loading) {
      console.log("Index: Authentication state ready, redirecting", { user: !!user });
      if (user) {
        navigate("/home", { replace: true });
      } else {
        navigate("/apresentacao", { replace: true });
      }
    }
  }, [user, loading, navigate]);
  
  // Return loading state while authentication is being checked
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-muted-foreground">Carregando...</p>
    </div>
  );
};

export default Index;
