import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, User, Plus, Trash, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";
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
    signOut,
    isAdmin
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

  // Extrai o nome de usuário do email (parte antes do @)
  const getUserName = () => {
    if (!user || !user.email) return "Usuário";
    return user.email.split('@')[0];
  };
  return <nav className="border-b sticky top-0 bg-background z-50">
      <div className="container mx-auto px-2 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="font-bold text-xl py-4 flex items-center">
            <Logo />
          </Link>
          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden ml-2" onClick={toggleMenu}>
            <Menu />
          </Button>
        </div>

        {/* Desktop navigation - Reorganized to put profile button before search */}
        <div className="hidden md:flex items-center gap-4">
           {/* Search form - now after profile button with increased width */}
          <form onSubmit={handleSearch} className="flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-80 pl-10" />
            </div>
          </form>
          {isAdmin && <Button variant="outline" size="sm" asChild>
              <Link to="/admin">
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Link>
            </Button>}
          <Button variant="ghost" size="sm" asChild>
            <Link to="/adicionar">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/lixeira">
              <Trash className="h-4 w-4 mr-2" />
              Lixeira
            </Link>
          </Button>
          <ThemeToggle />
          
          {/* Profile button - now before search */}
             
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="py-4 flex items-center">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <h2 className="font-medium">{getUserName()}</h2>
                      <p className="text-sm text-muted-foreground">{isAdmin ? 'Administrador' : 'Usuário'}</p>
                    </div>
                  </div>
                  
                  {isAdmin && <div className="py-2">
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link to="/admin">
                          <Settings className="h-4 w-4 mr-2" />
                          Painel de Administração
                        </Link>
                      </Button>
                    </div>}
                </div>
                
                <Button variant="outline" className="mt-auto" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </SheetContent>
          </Sheet>
       
        </div>
      </div>

      {/* Mobile menu - only visible when menu is open */}
      {isMenuOpen && <div className="md:hidden p-4 border-t">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar..." className="w-full pl-8" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
          </form>
          
          <div className="space-y-2">
            {isAdmin && <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/admin" onClick={toggleMenu}>
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Link>
              </Button>}
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/adicionar" onClick={toggleMenu}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/lixeira" onClick={toggleMenu}>
                <Trash className="h-4 w-4 mr-2" />
                Lixeira
              </Link>
            </Button>
            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" onClick={handleSignOut} className="flex-1">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
              <div className="ml-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>}
    </nav>;
};
export default Navbar;