
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, Film, Star, Clock } from "lucide-react";
import Logo from "@/components/Logo";

const SplashScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 px-4">
      <div className="w-full max-w-3xl text-center">
        {/* Logo Section */}
        <div className="mb-10 flex justify-center">
          <Logo />
        </div>
        
        <h1 className="text-4xl font-bold mb-3 text-gray-900">Bem-vindo ao MyMoovie</h1>
        <p className="text-lg text-gray-600 mb-12">
          Organize e acompanhe todos os seus filmes e séries favoritos em um só lugar.
        </p>
        
        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-center mb-4">
              <Film className="h-12 w-12 text-screentrack-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">Organize títulos</h3>
            <p className="text-gray-600">Catalogue filmes, séries e novelas de forma organizada e simples.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-center mb-4">
              <Star className="h-12 w-12 text-screentrack-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">Avalie conteúdos</h3>
            <p className="text-gray-600">Dê notas e salve suas opiniões sobre o que você assistiu.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-center mb-4">
              <Clock className="h-12 w-12 text-screentrack-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">Lista para assistir</h3>
            <p className="text-gray-600">Marque o que você quer assistir para não perder nada.</p>
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate("/login")} 
            className="w-full sm:w-auto"
          >
            <LogIn className="h-4 w-4 mr-1" />
            Entrar na conta
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate("/")} 
            className="w-full sm:w-auto"
          >
            Explorar sem login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
