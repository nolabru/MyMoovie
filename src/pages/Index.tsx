
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, loading } = useAuth();
  
  // If loading, return null to prevent premature redirects
  if (loading) return null;
  
  // If user is logged in, stay on index page, otherwise go to presentation
  if (!user) {
    return <Navigate to="/apresentacao" replace />;
  }
  
  // Returning null because Home component will be rendered directly at this route
  return null;
};

export default Index;
