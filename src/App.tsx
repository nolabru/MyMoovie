
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Home from "./pages/Home";
import TitleForm from "./pages/TitleForm";
import Auth from "./pages/Auth";
import Trash from "./pages/Trash";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import { TitlesProvider } from "./contexts/TitlesContext";

const queryClient = new QueryClient();

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <QueryClientProvider client={queryClient}>
      <TitlesProvider>
        <BrowserRouter>
          <Navbar onSearch={setSearchQuery} />
          <Routes>
            <Route path="/" element={<Home searchQuery={searchQuery} />} />
            <Route path="/adicionar" element={<TitleForm />} />
            <Route path="/editar/:id" element={<TitleForm />} />
            <Route path="/lixeira" element={<Trash />} />
            <Route path="/login" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Sonner />
          <Toaster />
        </BrowserRouter>
      </TitlesProvider>
    </QueryClientProvider>
  );
};

export default App;
