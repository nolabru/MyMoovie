
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface PublicOnlyRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ 
  children, 
  redirectTo = "/home" 
}) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Only redirect when loading is complete and user is authenticated
    if (!loading && user) {
      console.log("PublicOnlyRoute: User is authenticated, redirecting to", redirectTo);
      navigate(redirectTo, { replace: true });
    }
  }, [user, loading, navigate, redirectTo]);
  
  // If still loading or user is authenticated, show loading state
  if (loading || user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }
  
  // User is not authenticated, render the children (splash screen)
  return <>{children}</>;
};

export default PublicOnlyRoute;
