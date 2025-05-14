
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Index from "./pages/Index";
import TitleForm from "./pages/TitleForm";
import Auth from "./pages/Auth";
import TrashPage from "./pages/Trash";
import NotFound from "./pages/NotFound";
import SplashScreen from "./pages/SplashScreen";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";
import { TitlesProvider } from "./contexts/TitlesContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import { useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

// Improved component for protected routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  // If still loading auth state, show nothing to prevent flash
  if (loading) return null;
  
  // If no user is logged in, redirect to presentation page
  if (!user) {
    return <Navigate to="/apresentacao" replace />;
  }
  
  // User is authenticated, show the protected content
  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TitlesProvider>
            <BrowserRouter>
              <Routes>
                {/* Root path agora tem o conteúdo que estava em /home */}
                <Route path="/" element={<Index />} />
                
                {/* Splash screen como rota de apresentação */}
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
                        <Navbar onSearch={() => {}} />
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
                        <Navbar onSearch={() => {}} />
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
                        <Navbar onSearch={() => {}} />
                        <TrashPage />
                      </>
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Auth />} />
                
                {/* Rota para o painel administrativo */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  }
                />
                
                {/* Capturar todas as rotas desconhecidas */}
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
