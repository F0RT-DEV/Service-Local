import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AutenticacaoLocal';
import FormularioCadastro from '../../components/FormularioCadastro';

export default function CadastroAdmin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleCadastro = (dados) => {
    login('admin', dados.nome);
    navigate('/admin/dashboard');
  };

  return (
    <div className="p-4">
      <h2>Cadastro de Administrador</h2>
      <FormularioCadastro tipo="admin" onSubmit={handleCadastro} />
    </div>
  );
}