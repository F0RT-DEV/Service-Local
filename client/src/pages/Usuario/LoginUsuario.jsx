import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AutenticacaoLocal';

const LoginUsuario = () => {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('cliente'); // 'admin', 'prestador', 'cliente'
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(tipo, nome);

    if (tipo === 'admin') navigate('/admin/dashboard');
    else if (tipo === 'prestador') navigate('/prestador/dashboard');
    else navigate('/cliente/dashboard');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="cliente">Cliente</option>
          <option value="prestador">Prestador de Serviço</option>
          <option value="admin">Administrador</option>
        </select>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default LoginUsuario;
