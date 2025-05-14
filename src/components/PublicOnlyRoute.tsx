
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface PublicOnlyRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ 
  children, 
  redirectTo = "/" 
}) => {
  const { user, loading } = useAuth();
  
  // If still loading auth state, show loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If the user is logged in, redirect to the specified route
  if (user) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // Otherwise, render the children (splash screen)
  return <>{children}</>;
};

export default PublicOnlyRoute;
