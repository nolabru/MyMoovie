import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
const Logo: React.FC = () => {
  const navigate = useNavigate();
  const {
    theme
  } = useTheme();
  const handleLogoClick = () => {
    navigate("/");
  };
  return <div onClick={handleLogoClick} className="flex items-center cursor-pointer px-4\n">
      <div className="h-20 flex items-center">
        <img src="/lovable-uploads/07958c6a-95c6-4395-be58-0f04eec7daba.png" alt="MyMoovie Logo" className="h-20 w-auto object-contain" />
      </div>
    </div>;
};
export default Logo;