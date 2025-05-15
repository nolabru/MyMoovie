
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
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";
import { TitlesProvider } from "./contexts/TitlesContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import { useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";

const queryClient = new QueryClient();

// Protected route for regular users only (not admins)
const RegularUserRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin } = useAuth();
  
  // If still loading auth state, show nothing to prevent flash
  if (loading) return null;
  
  // If no user is logged in, redirect to presentation page
  if (!user) {
    return <Navigate to="/apresentacao" replace />;
  }
  
  // If user is admin, redirect to admin page
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  
  // User is authenticated and not an admin, show the protected content
  return <>{children}</>;
};

// Protected route for any authenticated user
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

// Protected route only for admin users
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin } = useAuth();
  
  // If still loading auth state, show nothing to prevent flash
  if (loading) return null;
  
  // If no user is logged in, redirect to presentation page
  if (!user) {
    return <Navigate to="/apresentacao" replace />;
  }
  
  // If user is not an admin, redirect to home
  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }
  
  // User is authenticated and admin, show the protected content
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
                {/* Root path redirects based on auth state */}
                <Route path="/" element={<Index />} />
                
                {/* Dashboard - Only accessible for regular users */}
                <Route path="/home" element={
                  <RegularUserRoute>
                    <>
                      <Navbar onSearch={setSearchQuery} />
                      <Home searchQuery={searchQuery} />
                    </>
                  </RegularUserRoute>
                } />
                
                {/* Splash screen as presentation route */}
                <Route path="/apresentacao" element={
                  <PublicOnlyRoute>
                    <SplashScreen />
                  </PublicOnlyRoute>
                } />
                
                <Route
                  path="/adicionar"
                  element={
                    <RegularUserRoute>
                      <>
                        <Navbar onSearch={setSearchQuery} />
                        <TitleForm />
                      </>
                    </RegularUserRoute>
                  }
                />
                <Route
                  path="/editar/:id"
                  element={
                    <RegularUserRoute>
                      <>
                        <Navbar onSearch={setSearchQuery} />
                        <TitleForm />
                      </>
                    </RegularUserRoute>
                  }
                />
                <Route
                  path="/lixeira"
                  element={
                    <RegularUserRoute>
                      <>
                        <Navbar onSearch={setSearchQuery} />
                        <TrashPage />
                      </>
                    </RegularUserRoute>
                  }
                />
                <Route path="/login" element={<Auth />} />
                
                {/* Rota para o painel administrativo - apenas para admin */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <Admin />
                    </AdminRoute>
                  }
                />
                
                {/* Catch all unknown routes and ensure they redirect appropriately */}
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
