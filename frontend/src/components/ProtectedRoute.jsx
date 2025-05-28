import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AutenticacaoLocal';

const ProtectedRoute = ({ children, tipoPermitido }) => {
  const { estaAutenticado, getUsuario, carregando } = useAuth();
  
  if (carregando) {
    return <div className="loading">Carregando...</div>;
  }
  
  if (!estaAutenticado()) {
    return <Navigate to="/" replace />;
  }
  
  if (tipoPermitido) {
    const usuario = getUsuario();
    if (usuario.tipo !== tipoPermitido) {
      return <Navigate to="/\" replace />;
    }
  }
  
  return children;
};

export default ProtectedRoute;