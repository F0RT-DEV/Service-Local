import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AutenticacaoLocal';
import FormularioCadastro from '../../components/FormularioCadastro';

export default function CadastroPrestador() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleCadastro = (dados) => {
    login('prestador', dados.nome);
    navigate('/prestador/dashboard');
  };

  return (
    <div className="p-4">
      <h2>Cadastro de Prestador de Serviço</h2>
      <FormularioCadastro tipo="prestador" onSubmit={handleCadastro} />
    </div>
  );
}