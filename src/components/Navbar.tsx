import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [isAdmin, setIsAdmin] = useState(false);
  const {
    user,
    signOut
  } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase.rpc('is_admin', { user_id: user.id });
        
        if (error) {
          throw error;
        }
        
        setIsAdmin(!!data);
      } catch (error: any) {
        console.error("Erro ao verificar status de admin:", error.message);
        setIsAdmin(false);
      }
    };

    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const getUserInitials = () => {
    if (!user || !user.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <nav className="border-b sticky top-0 bg-background z-50">
      <div className="container mx-auto px-2 flex items-center justify-between">
        <div className="flex items-center">
          {adminOnly ? (
            <Link to="/admin" className="mr-6">
              <Logo />
            </Link>
          ) : (
            <Link to="/home" className="mr-6">
              <Logo />
            </Link>
          )}
        </div>

        {!adminOnly && (
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
          <ThemeToggle />
          
          <div className="flex items-center space-x-2">
            {user && (
              <>
                {!adminOnly && (
                  <>
                    {isAdmin && (
                      <Button variant="ghost" asChild>
                        <Link to="/admin">
                          <Shield className="h-4 w-4 mr-1" />
                          Admin
                        </Link>
                      </Button>
                    )}
                  </>
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

            {!user && !adminOnly && (
              <Button variant="outline" asChild>
                <Link to="/login">
                  <User className="h-4 w-4 mr-1" />
                  Entrar
                </Link>
              </Button>
            )}
          </div>

          {!adminOnly && (
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
          )}
        </div>
      </div>

      {/* Menu mobile - only show for non-admin pages */}
      {isMenuOpen && !adminOnly && (
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
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/adicionar">Adicionar Título</Link>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/lixeira">Lixeira</Link>
                </Button>
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
