import React from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, FolderKanban, Film, Users, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
const AdminSidebar = () => {
  const {
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };
  return <aside className="w-64 min-h-screen bg-card border-r flex flex-col">
      <div className="px-4 py-0 border-b">
        <Logo />
        
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted">
          <BarChart size={20} />
          <span>Dashboard</span>
        </div>
        <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted">
          <FolderKanban size={20} />
          <span>Categorias</span>
        </div>
        <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted">
          <Film size={20} />
          <span>Tipos</span>
        </div>
        <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted">
          <Users size={20} />
          <span>Usuários</span>
        </div>
      </nav>
      
      <div className="p-4 border-t">
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
    </aside>;
};
export default AdminSidebar;