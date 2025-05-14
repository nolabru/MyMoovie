
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Home, Plus, Menu, X, LogOut, FolderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import Logo from "./Logo";
import { Trash2 } from "lucide-react";

const Navbar = ({
  onSearch
}: {
  onSearch: (query: string) => void;
}) => {
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    user,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/apresentacao");
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer logout");
    }
  };

  // Check if the current user is an admin (email ends with @admin.com)
  const isAdmin = user && user.email?.endsWith('@admin.com');
  
  return <nav className="sticky top-0 z-10 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="flex items-center gap-2">
          <Logo />
        </div>

        <div className="flex items-center ml-auto gap-2">
          {/* Display search on large screens */}
          <div className="relative hidden md:block w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Buscar..." 
              onChange={e => {
                onSearch(e.target.value);
                setSearch(e.target.value);
              }} 
              className="w-full pl-8 bg-secondary/50" 
            />
          </div>

          {isMobile ? <>
              {/* Mobile Menu Toggle */}
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Menu">
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>

              {/* Mobile Menu */}
              {mobileMenuOpen && <div className="absolute top-16 right-0 w-full bg-background border-b shadow-lg z-10">
                  <div className="flex flex-col p-4 gap-2">
                    <div className="relative w-full mb-4">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="search" 
                        placeholder="Buscar..." 
                        onChange={e => {
                          onSearch(e.target.value);
                          setSearch(e.target.value);
                        }} 
                        className="w-full pl-8 bg-secondary/50" 
                      />
                    </div>
                    
                    <Button asChild variant="ghost" className="justify-start">
                      <Link to="/home">
                        <Home className="mr-2 h-4 w-4" />
                        Início
                      </Link>
                    </Button>
                    
                    <Button asChild variant="ghost" className="justify-start">
                      <Link to="/adicionar">
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar
                      </Link>
                    </Button>
                    
                    <Button asChild variant="ghost" className="justify-start">
                      <Link to="/lixeira">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Lixeira
                      </Link>
                    </Button>

                    {/* Admin menu items for mobile */}
                    {isAdmin && <Button asChild variant="ghost" className="justify-start">
                        <Link to="/admin/categorias">
                          <FolderIcon className="mr-2 h-4 w-4" />
                          Gerenciar Categorias
                        </Link>
                      </Button>}
                    
                    <ThemeToggle />
                    
                    <Button variant="ghost" className="justify-start" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </Button>
                  </div>
                </div>}
            </> : <>
              {/* Desktop Navigation */}
              <Button asChild variant="ghost" size="icon">
                <Link to="/home" aria-label="Início">
                  <Home className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button asChild variant="ghost" size="icon">
                <Link to="/adicionar" aria-label="Adicionar">
                  <Plus className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button asChild variant="ghost" size="icon">
                <Link to="/lixeira" aria-label="Lixeira">
                  <Trash2 className="h-5 w-5" />
                </Link>
              </Button>

              {/* Admin menu items for desktop */}
              {isAdmin && <Button asChild variant="ghost" size="icon">
                  <Link to="/admin/categorias" aria-label="Gerenciar Categorias">
                    <FolderIcon className="h-5 w-5" />
                  </Link>
                </Button>}
              
              <ThemeToggle />
              
              <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Sair">
                <LogOut className="h-5 w-5" />
              </Button>
            </>}
        </div>
      </div>
    </nav>;
};

export default Navbar;
