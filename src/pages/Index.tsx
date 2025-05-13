
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, loading } = useAuth();
  
  // If loading, return null to prevent premature redirects
  if (loading) return null;
  
  // If user is logged in, go to dashboard, otherwise to presentation
  if (user) {
    return <Navigate to="/" replace />;
  } else {
    return <Navigate to="/apresentacao" replace />;
  }
};

export default Index;
