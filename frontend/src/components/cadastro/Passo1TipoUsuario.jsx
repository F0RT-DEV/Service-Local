import React from 'react';
import { UserIcon, WrenchIcon } from 'lucide-react';
import './Passo1TipoUsuario.css';

const Passo1TipoUsuario = ({ tipoSelecionado, onSelecionar, erro }) => {
  return (
    <div className="passo-container">
      <h2 className="text-xl font-semibold mb-6">Escolha o tipo de conta</h2>
      
      <div className="tipo-usuario-opcoes">
        <div 
          className={`tipo-card ${tipoSelecionado === 'usuario' ? 'selecionado' : ''}`}
          onClick={() => onSelecionar('usuario')}
        >
          <div className="icone-container usuario">
            <UserIcon size={40} />
          </div>
          <h3 className="text-lg font-medium mt-3">Usuário Comum</h3>
          <p className="text-gray-600 mt-2">
            Procuro profissionais para realizar serviços técnicos
          </p>
        </div>
        
        <div 
          className={`tipo-card ${tipoSelecionado === 'prestador' ? 'selecionado' : ''}`}
          onClick={() => onSelecionar('prestador')}
        >
          <div className="icone-container prestador">
            <WrenchIcon size={40} />
          </div>
          <h3 className="text-lg font-medium mt-3">Prestador de Serviço</h3>
          <p className="text-gray-600 mt-2">
            Ofereço serviços técnicos e busco novos clientes
          </p>
        </div>
      </div>
      
      {erro && <p className="mensagem-erro mt-4 text-center">{erro}</p>}
    </div>
  );
};

export default Passo1TipoUsuario;