
import React from "react";
import { useNavigate } from "react-router-dom";

const Logo: React.FC = () => {
  const navigate = useNavigate();
  
  const handleLogoClick = () => {
    navigate("/home");
  };

  return (
    <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
      <img 
        src="/lovable-uploads/2d1d352f-1c83-47f3-8214-1f93d6df5bed.png" 
        alt="MyMoovie Logo" 
        className="h-8" 
      />
    </div>
  );
};

export default Logo;
