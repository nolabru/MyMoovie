
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Shield, Search, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "./Logo";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ThemeToggle from "./ThemeToggle";
import { supabase } from "@/integrations/supabase/client";

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
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-1" />
                  Sair
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
          <Link to="/home" className="mr-6">
            <Logo />
          </Link>
        </div>

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

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <div className="flex items-center space-x-2">
            {user && (
              <>
                {isAdmin && (
                  <Button variant="ghost" asChild>
                    <Link to="/admin">
                      <Shield className="h-4 w-4 mr-1" />
                      Admin
                    </Link>
                  </Button>
                )}

                <div className="flex items-center gap-5">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-1" />
                    Sair
                  </Button>
                </div>
              </>
            )}

            {!user && (
              <Button variant="outline" asChild>
                <Link to="/login">
                  <User className="h-4 w-4 mr-1" />
                  Entrar
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
          <form onSubmit={(e) => {
            e.preventDefault();
            onSearch(searchQuery);
          }} className="mb-4 relative">
            <Input type="text" placeholder="Buscar por título..." className="pr-10 w-full" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-4 w-4 text-muted-foreground" />
            </button>
          </form>
          <div className="flex flex-col space-y-2">
            <Button variant="ghost" className="justify-start" asChild>
              <Link to="/">Início</Link>
            </Button>
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
