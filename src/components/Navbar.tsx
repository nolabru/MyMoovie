
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Shield, Search, Menu, User, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "./Logo";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ThemeToggle from "./ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NavbarProps {
  onSearch: (query: string) => void;
  adminOnly?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  onSearch,
  adminOnly = false
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    user,
    signOut,
    isAdmin
  } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const getUserInitials = () => {
    if (!user || !user.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  const handleAddTitle = () => {
    if (!user) {
      toast.error("Você precisa estar logado para adicionar títulos");
      navigate("/login");
      return;
    }
    navigate("/adicionar");
  };

  const handleTrashClick = () => {
    navigate("/lixeira");
  };

  // For admin panel, we use a simplified navbar
  if (adminOnly) {
    return (
      <nav className="border-b sticky top-0 bg-background z-50">
        <div className="container mx-auto px-2 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/admin" className="mr-6">
              <Logo />
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {user && (
              <div className="flex items-center gap-5">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>
    );
  }

  // Regular navbar for non-admin pages
  return (
    <nav className="border-b sticky top-0 bg-background z-50">
      <div className="container mx-auto px-2 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="mr-6">
            <Logo />
          </Link>
        </div>

        {/* Search bar - only visible for non-admin users */}
        {!isAdmin && (
          <div className="hidden md:flex items-center flex-grow max-w-md mx-4">
            <form onSubmit={(e) => {
              e.preventDefault();
              onSearch(searchQuery);
            }} className="w-full relative">
              <Input type="text" placeholder="Buscar por título..." className="pr-10 w-full" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2" aria-label="Buscar">
                <Search className="h-4 w-4 text-muted-foreground" />
              </button>
            </form>
          </div>
        )}

        <div className="flex items-center gap-4">
          {/* Botões de lixeira e adicionar título - apenas para usuários comuns autenticados (não-admin) */}
          {user && !isAdmin && (
            <div className="hidden md:flex gap-2">
              <Button variant="ghost" size="icon" onClick={handleTrashClick} title="Lixeira">
                <Trash className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="icon" onClick={handleAddTitle} title="Adicionar Título">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}

          <ThemeToggle />
          
          <div className="flex items-center space-x-2">
            {user && (
              <>
                {isAdmin && (
                  <Button variant="ghost" size="icon" asChild>
                    <Link to="/admin" title="Painel Admin">
                      <Shield className="h-4 w-4" />
                    </Link>
                  </Button>
                )}

                <div className="flex items-center gap-5">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sair">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}

            {!user && (
              <Button variant="ghost" size="icon" asChild>
                <Link to="/login" title="Entrar">
                  <User className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden p-4 bg-background border-t">
          {/* Only show search for non-admin users */}
          {!isAdmin && (
            <form onSubmit={(e) => {
              e.preventDefault();
              onSearch(searchQuery);
            }} className="mb-4 relative">
              <Input type="text" placeholder="Buscar por título..." className="pr-10 w-full" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Search className="h-4 w-4 text-muted-foreground" />
              </button>
            </form>
          )}
          
          <div className="flex flex-col space-y-2">
            {!isAdmin && (
              <Button variant="ghost" className="justify-start" asChild>
                <Link to="/">Início</Link>
              </Button>
            )}
            
            {user && !isAdmin && (
              <>
                <Button variant="ghost" className="justify-start" onClick={handleTrashClick}>
                  <Trash className="h-4 w-4 mr-2" />
                  Lixeira
                </Button>
                <Button variant="ghost" className="justify-start" onClick={handleAddTitle}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Título
                </Button>
              </>
            )}
            {user ? <>
                {isAdmin && (
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link to="/admin">Painel Admin</Link>
                  </Button>
                )}
                <Button variant="ghost" className="justify-start" onClick={handleSignOut}>
                  Sair
                </Button>
              </> : <Button variant="ghost" className="justify-start" asChild>
                <Link to="/login">Entrar</Link>
              </Button>}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
