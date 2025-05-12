
import React from "react";
import { Film } from "lucide-react";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <Film className="h-6 w-6 text-primary" />
      <span className="font-bold text-xl">MyMoovie</span>
    </div>
  );
};

export default Logo;
