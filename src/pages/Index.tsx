
import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Use useEffect to prevent render loops
  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate("/home", { replace: true });
      } else {
        navigate("/apresentacao", { replace: true });
      }
    }
  }, [user, loading, navigate]);
  
  // While loading or during navigation, show loading indicator
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};

export default Index;
