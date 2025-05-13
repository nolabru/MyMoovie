
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
import Navbar from "./components/Navbar";
import { TitlesProvider } from "./contexts/TitlesContext";
import { AuthProvider } from "./contexts/AuthContext";
import PublicOnlyRoute from "./components/PublicOnlyRoute";

const queryClient = new QueryClient();

// Component for protected routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("sb-ulfkuvsweviuggeznfkx-auth-token");
  if (!token) {
    return <Navigate to="/apresentacao" replace />;
  }
  return <>{children}</>;
};

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TitlesProvider>
          <BrowserRouter>
            <Routes>
              {/* Dashboard na rota principal - Only accessible when logged in */}
              <Route path="/" element={
                <ProtectedRoute>
                  <>
                    <Navbar onSearch={setSearchQuery} />
                    <Home searchQuery={searchQuery} />
                  </>
                </ProtectedRoute>
              } />
              
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
              
              {/* Root path needs to check auth status and redirect */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Sonner />
            <Toaster />
          </BrowserRouter>
        </TitlesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
