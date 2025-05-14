
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Only redirect once auth has been determined
    if (!loading) {
      // If user is logged in, go to main page, otherwise to presentation
      if (user) {
        navigate("/", { replace: true });
      } else {
        navigate("/apresentacao", { replace: true });
      }
    }
  }, [user, loading, navigate]);
  
  // Return loading state while determining where to redirect
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground">Carregando...</p>
    </div>
  );
};

export default Index;
