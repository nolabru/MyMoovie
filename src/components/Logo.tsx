
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

const Logo: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
      {theme === "dark" ? (
        <img 
          src="/lovable-uploads/8d7930a2-72fe-4495-bc8b-f36845e7e9fc.png" 
          alt="MyMoovie Logo Dark" 
          className="h-20" 
        />
      ) : (
        <img 
          src="/lovable-uploads/2d1d352f-1c83-47f3-8214-1f93d6df5bed.png" 
          alt="MyMoovie Logo Light" 
          className="h-20" 
        />
      )}
    </div>
  );
};

export default Logo;
