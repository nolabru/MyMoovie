
import React from "react";
import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirecionamos para a raiz, que agora tem a splash screen
  return <Navigate to="/" replace />;
};

export default Index;
