
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AdminRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ 
  children, 
  redirectTo = "/" 
}) => {
  const { user, loading, isAdmin } = useAuth();
  
  // If still loading auth state, show loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If the user is not logged in or not an admin, redirect
  if (!user || !isAdmin) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // If the user is admin, render the admin content
  return <>{children}</>;
};

export default AdminRoute;
