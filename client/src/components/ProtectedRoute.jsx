import React from 'react';
import { Navigate } from 'react-router-dom';

const getUsuarioLocal = () => {
  try {
    const usuario = localStorage.getItem("usuario");
    return usuario ? JSON.parse(usuario) : null;
  } catch {
    return null;
  }
};

const ProtectedRoute = ({ children, tipoPermitido }) => {
  const usuario = getUsuarioLocal();

  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  if (tipoPermitido && usuario.role !== tipoPermitido) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;