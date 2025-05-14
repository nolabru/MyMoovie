
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface PublicOnlyRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ 
  children, 
  redirectTo = "/home" 
}) => {
  const { user, loading } = useAuth();
  const [isChecked, setIsChecked] = useState(false);
  
  useEffect(() => {
    // Only mark as checked when loading is complete
    if (!loading) {
      setIsChecked(true);
    }
  }, [loading]);
  
  // Wait until authentication check is complete before making redirection decisions
  if (!isChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // If the user is logged in, redirect to the specified route
  if (user) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // User is not authenticated, render the children (public content)
  return <>{children}</>;
};

export default PublicOnlyRoute;
