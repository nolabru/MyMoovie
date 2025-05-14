
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
  
  // If still loading auth state, show nothing to prevent flash
  if (loading) return null;
  
  // If the user is logged in, redirect to the specified route
  if (user) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // Otherwise, render the children (splash screen)
  return <>{children}</>;
};

export default PublicOnlyRoute;
