import React from 'react';
import { useAuth } from '../../context/AutenticacaoLocal';

const Dashboard = () => {
  const { usuario, logout } = useAuth();

  return (
    <div>
      <h2>Bem-vindo, {usuario?.nome}!</h2>
      <p>Tipo de usuário: {usuario?.tipo}</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
};

export default Dashboard;