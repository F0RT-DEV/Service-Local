import React from 'react';
import { useAuth } from '../../context/AutenticacaoLocal';
import { useNavigate } from 'react-router-dom';
import './DashboardPrestador.css'; // Estilo externo (crie esse arquivo)

const DashboardPrestador = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-prestador">
      <h1>Bem-vindo, {usuario?.nome || 'Prestador'}!</h1>
      <p className="descricao">Aqui está o seu painel de controle.</p>

      <div className="dados-usuario">
        <h2>Seu Perfil</h2>
        <ul>
          <li><strong>Nome:</strong> {usuario?.nome}</li>
          <li><strong>Email:</strong> {usuario?.email}</li>
          <li><strong>Área:</strong> {usuario?.area || 'Não informado'}</li>
          <li><strong>Especialidade:</strong> {usuario?.especialidade || 'Não informado'}</li>
          <li><strong>Experiência:</strong> {usuario?.experiencia || 'Não informada'}</li>
        </ul>
      </div>

      <button onClick={handleLogout} className="btn-sair">
        Sair
      </button>
    </div>
  );
};

export default DashboardPrestador;