
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = "/login" 
}) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [hasRedirected, setHasRedirected] = useState(false);
  
  useEffect(() => {
    // Only redirect when loading is complete and user is not authenticated
    if (!loading && !user && !hasRedirected) {
      console.log("ProtectedRoute: User not authenticated, redirecting to", redirectTo);
      
      // Set the flag to prevent multiple redirects
      setHasRedirected(true);
      
      // Use a short timeout to ensure state is fully updated before navigation
      setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 10);
    }
  }, [user, loading, navigate, redirectTo, hasRedirected]);
  
  // Show loading state while checking authentication or redirecting
  if (loading || (!user && !hasRedirected) || hasRedirected) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }
  
  // User is authenticated, render the protected content
  return <>{children}</>;
};
