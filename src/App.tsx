
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

// Improved ProtectedRoute component with better loading and auth state handling
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  // Show loading indicator while auth state is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // If no user is logged in, redirect to the presentation page
  if (!user) {
    return <Navigate to="/apresentacao" replace />;
  }
  
  // User is authenticated, render the protected content
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
                {/* Simple redirect route that checks auth state */}
                <Route path="/" element={<Index />} />
                
                {/* Presentation page - only accessible when not logged in */}
                <Route path="/apresentacao" element={
                  <PublicOnlyRoute>
                    <SplashScreen />
                  </PublicOnlyRoute>
                } />
                
                {/* Login page - only accessible when not logged in */}
                <Route path="/login" element={
                  <PublicOnlyRoute>
                    <Auth />
                  </PublicOnlyRoute>
                } />
                
                {/* Protected routes - only accessible when logged in */}
                <Route path="/home" element={
                  <ProtectedRoute>
                    <>
                      <Navbar onSearch={setSearchQuery} />
                      <Home searchQuery={searchQuery} />
                    </>
                  </ProtectedRoute>
                } />
                
                <Route path="/admin/categorias" element={
                  <AdminRoute>
                    <>
                      <Navbar onSearch={setSearchQuery} />
                      <AdminCategories />
                    </>
                  </AdminRoute>
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
                
                {/* Catch all unknown routes */}
                <Route path="*" element={<NotFound />} />
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
