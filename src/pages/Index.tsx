
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [hasRedirected, setHasRedirected] = useState(false);
  
  useEffect(() => {
    // Only redirect when loading is complete and we haven't redirected yet
    if (!loading && !hasRedirected) {
      console.log("Index: Authentication state ready, redirecting", { user: !!user });
      
      // Set the flag to prevent multiple redirects
      setHasRedirected(true);
      
      // Use a short timeout to ensure state is fully updated before navigation
      setTimeout(() => {
        if (user) {
          navigate("/home", { replace: true });
        } else {
          navigate("/apresentacao", { replace: true });
        }
      }, 10);
    }
  }, [user, loading, navigate, hasRedirected]);
  
  // Return loading state while authentication is being checked
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-muted-foreground">Carregando...</p>
    </div>
  );
};

export default Index;
