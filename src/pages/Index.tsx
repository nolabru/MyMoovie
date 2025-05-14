
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();
  const [isChecked, setIsChecked] = useState(false);
  
  useEffect(() => {
    // Only mark as checked when loading is complete
    if (!loading) {
      setIsChecked(true);
    }
  }, [loading]);
  
  // Show loading indicator while authentication state is being determined
  if (!isChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  
  // Once authentication check is complete, redirect based on user state
  if (user) {
    return <Navigate to="/home" replace />;
  }
  
  return <Navigate to="/apresentacao" replace />;
};

export default Index;
