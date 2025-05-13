
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface PublicOnlyRouteProps {
  children: React.ReactNode;
}

const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ children }) => {
  const { user } = useAuth();
  
  // If the user is logged in, redirect to the home page
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  // Otherwise, render the children (splash screen)
  return <>{children}</>;
};

export default PublicOnlyRoute;
