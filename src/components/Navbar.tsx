
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, User, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "./Logo";

interface NavbarProps {
  onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Simulando que o usuário não está autenticado inicialmente
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Simular login/logout para demonstração
  const toggleAuth = () => {
    setIsAuthenticated(!isAuthenticated);
  };

  return (
    <nav className="border-b sticky top-0 bg-white z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="mr-6">
            <Logo />
          </Link>
        </div>

        <div className="hidden md:flex items-center flex-grow max-w-md mx-4">
          <form onSubmit={handleSearch} className="w-full relative">
            <Input
              type="text"
              placeholder="Buscar por título..."
              className="pr-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              aria-label="Buscar"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
            </button>
          </form>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center space-x-2">
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
            {!isAuthenticated ? (
              <Button variant="outline" asChild onClick={toggleAuth}>
                <Link to="/login">
                  <User className="h-4 w-4 mr-1" />
                  Entrar
                </Link>
              </Button>
            ) : (
              <Button variant="outline" onClick={toggleAuth}>
                <User className="h-4 w-4 mr-1" />
                Minha Conta
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden p-4 bg-background border-t">
          <form onSubmit={handleSearch} className="mb-4 relative">
            <Input
              type="text"
              placeholder="Buscar por título..."
              className="pr-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
            </button>
          </form>
          <div className="flex flex-col space-y-2">
            <Button variant="ghost" className="justify-start" asChild>
              <Link to="/">Início</Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <Link to="/adicionar">Adicionar Título</Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <Link to="/lixeira">Lixeira</Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
