
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, loading } = useAuth();
  
  // If still loading authentication status, show a simple loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Once loaded, redirect based on auth state
  if (user) {
    return <Navigate to="/home" replace />;
  } else {
    return <Navigate to="/apresentacao" replace />;
  }
};

export default Index;
