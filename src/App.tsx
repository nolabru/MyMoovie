
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Home from "./pages/Home";
import TitleForm from "./pages/TitleForm";
import Auth from "./pages/Auth";
import TrashPage from "./pages/Trash";
import NotFound from "./pages/NotFound";
import SplashScreen from "./pages/SplashScreen";
import AdminDashboard from "./pages/admin/Dashboard";
import Navbar from "./components/Navbar";
import { TitlesProvider } from "./contexts/TitlesContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import AdminRoute from "./components/AdminRoute";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TitlesProvider>
            <BrowserRouter>
              <Routes>
                {/* Root path handles redirection based on auth state */}
                <Route path="/" element={<Index />} />
                
                {/* Presentation route - only for unauthenticated users */}
                <Route 
                  path="/apresentacao" 
                  element={
                    <PublicOnlyRoute>
                      <SplashScreen />
                    </PublicOnlyRoute>
                  } 
                />
                
                {/* Authentication route - only for unauthenticated users */}
                <Route 
                  path="/login" 
                  element={
                    <PublicOnlyRoute>
                      <Auth />
                    </PublicOnlyRoute>
                  } 
                />
                
                {/* Protected routes */}
                <Route
                  path="/home"
                  element={
                    <>
                      <Navbar onSearch={setSearchQuery} />
                      <Home searchQuery={searchQuery} />
                    </>
                  }
                />
                
                <Route
                  path="/adicionar"
                  element={
                    <>
                      <Navbar onSearch={setSearchQuery} />
                      <TitleForm />
                    </>
                  }
                />
                
                <Route
                  path="/editar/:id"
                  element={
                    <>
                      <Navbar onSearch={setSearchQuery} />
                      <TitleForm />
                    </>
                  }
                />
                
                <Route
                  path="/lixeira"
                  element={
                    <>
                      <Navbar onSearch={setSearchQuery} />
                      <TrashPage />
                    </>
                  }
                />
                
                {/* Admin route */}
                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
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
