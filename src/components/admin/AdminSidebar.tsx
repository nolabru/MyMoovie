
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { BarChart, FolderKanban, Film, Users, Home, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";

const AdminSidebar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-card border-r flex flex-col">
      <div className="p-4 border-b">
        <Logo />
        <h2 className="text-xl font-bold mt-2">Painel Admin</h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <Link to="/admin" className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted">
          <BarChart size={20} />
          <span>Dashboard</span>
        </Link>
        <Link to="/admin?tab=categories" className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted">
          <FolderKanban size={20} />
          <span>Categorias</span>
        </Link>
        <Link to="/admin?tab=types" className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted">
          <Film size={20} />
          <span>Tipos</span>
        </Link>
        <Link to="/admin?tab=users" className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted">
          <Users size={20} />
          <span>Usuários</span>
        </Link>
      </nav>
      
      <div className="p-4 border-t">
        <Link to="/home" className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted mb-2">
          <Home size={20} />
          <span>Voltar para Home</span>
        </Link>
        
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleSignOut} className="flex-1">
            <LogOut size={16} className="mr-2" />
            Sair
          </Button>
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
