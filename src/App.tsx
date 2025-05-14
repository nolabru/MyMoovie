import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Home from "./pages/Home";
import TitleForm from "./pages/TitleForm";
import Auth from "./pages/Auth";
import TrashPage from "./pages/Trash";
import NotFound from "./pages/NotFound";
import SplashScreen from "./pages/SplashScreen";
import AdminCategories from "./pages/AdminCategories";
import Navbar from "./components/Navbar";
import { TitlesProvider } from "./contexts/TitlesContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import AdminRoute from "./components/AdminRoute";
import { useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

// Componente melhorado para rotas protegidas com tratamento de loading
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  // Se ainda estiver carregando o estado de autenticação, mostrar indicador de carregamento
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Se nenhum usuário estiver logado, redirecionar para a página de apresentação
  if (!user) {
    return <Navigate to="/apresentacao" replace />;
  }
  
  // Usuário está autenticado, mostrar o conteúdo protegido
  return <>{children}</>;
};

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TitlesProvider>
            <BrowserRouter>
              <Routes>
                {/* Rota raiz redireciona com base no estado de autenticação */}
                <Route path="/" element={<Index />} />
                
                {/* Dashboard - Acessível apenas quando logado */}
                <Route path="/home" element={
                  <ProtectedRoute>
                    <>
                      <Navbar onSearch={setSearchQuery} />
                      <Home searchQuery={searchQuery} />
                    </>
                  </ProtectedRoute>
                } />
                
                {/* Painel Admin - Acessível apenas com email admin */}
                <Route path="/admin/categorias" element={
                  <AdminRoute>
                    <>
                      <Navbar onSearch={setSearchQuery} />
                      <AdminCategories />
                    </>
                  </AdminRoute>
                } />
                
                {/* Tela inicial como rota de apresentação pública */}
                <Route path="/apresentacao" element={
                  <PublicOnlyRoute>
                    <SplashScreen />
                  </PublicOnlyRoute>
                } />
                
                <Route
                  path="/adicionar"
                  element={
                    <ProtectedRoute>
                      <>
                        <Navbar onSearch={setSearchQuery} />
                        <TitleForm />
                      </>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/editar/:id"
                  element={
                    <ProtectedRoute>
                      <>
                        <Navbar onSearch={setSearchQuery} />
                        <TitleForm />
                      </>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/lixeira"
                  element={
                    <ProtectedRoute>
                      <>
                        <Navbar onSearch={setSearchQuery} />
                        <TrashPage />
                      </>
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Auth />} />
                
                {/* Captura todas as rotas desconhecidas e garante redirecionamento 
                   para login se não autenticado */}
                <Route path="*" element={
                  <ProtectedRoute>
                    <NotFound />
                  </ProtectedRoute>
                } />
              </Routes>
              <Sonner />
              <Toaster />
            </BrowserRouter>
          </TitlesProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
