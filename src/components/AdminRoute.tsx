import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface AdminRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ 
  children, 
  redirectTo = "/admin/categorias" 
}) => {
  const { user, loading } = useAuth();
  
  // If still loading auth state, show a loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Check if the user is logged in and has an admin email
  const isAdmin = user && user.email?.endsWith('@admin.com');
  
  // If the user is not an admin, redirect to the specified route
  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }
  
  // Otherwise, render the children (admin content)
  return <>{children}</>;
};

export default AdminRoute;
