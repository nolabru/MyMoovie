
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, User, Plus, Trash, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "./Logo";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
  onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    user,
    signOut
  } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const getUserInitials = () => {
    if (!user || !user.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  return <nav className="border-b sticky top-0 bg-background z-50">
      <div className="container mx-auto px-2 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="mr-6">
            <Logo />
          </Link>
        </div>

        <div className="hidden md:flex items-center flex-grow max-w-md mx-4">
          <form onSubmit={handleSearch} className="w-full relative">
            <Input type="text" placeholder="Buscar por título..." className="pr-10 w-full" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2" aria-label="Buscar">
              <Search className="h-4 w-4 text-muted-foreground" />
            </button>
          </form>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <div className="hidden md:flex items-center space-x-2">
            {user && <>
                <Button variant="ghost" asChild>
                  <Link to="/adicionar">
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/lixeira">
                    <Trash className="h-4 w-4 mr-1" />
                    Lixeira
                  </Link>
                </Button>
              </>}

            {!user ? <Button variant="outline" asChild>
                <Link to="/login">
                  <User className="h-4 w-4 mr-1" />
                  Entrar
                </Link>
              </Button> : <div className="flex items-center gap-5">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-1" />
                  Sair
                </Button>
              </div>}
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && <div className="md:hidden p-4 bg-background border-t">
          <form onSubmit={handleSearch} className="mb-4 relative">
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
                <Button variant="ghost" className="justify-start" onClick={handleSignOut}>
                  Sair
                </Button>
              </> : <Button variant="ghost" className="justify-start" asChild>
                <Link to="/login">Entrar</Link>
              </Button>}
          </div>
        </div>}
    </nav>;
};

export default Navbar;
