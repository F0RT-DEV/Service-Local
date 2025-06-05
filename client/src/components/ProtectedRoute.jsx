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
 const role = usuario?.role === "user" ? "client" : usuario?.role;
  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  if (tipoPermitido && role !== tipoPermitido) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;