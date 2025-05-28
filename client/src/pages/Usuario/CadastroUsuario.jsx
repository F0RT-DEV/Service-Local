import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AutenticacaoLocal';
import FormularioCadastro from '../../components/FormularioCadastro';

export default function CadastroCliente() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleCadastro = (dados) => {
    login('cliente', dados.nome);
    navigate('/cliente/dashboard');
  };

  return (
    <div className="p-4">
      <h2>Cadastro de Cliente</h2>
      <FormularioCadastro tipo="cliente" onSubmit={handleCadastro} />
    </div>
  );
}