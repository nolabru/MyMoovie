
import React from "react";
import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirecionamos para a página de splash screen
  return <Navigate to="/splash" replace />;
};

export default Index;
