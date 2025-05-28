import React from 'react';
import { CheckIcon } from 'lucide-react';
import './ProgressoCadastro.css';

const ProgressoCadastro = ({ passoAtual, totalPassos }) => {
  const passos = [
    { numero: 1, titulo: 'Tipo de Conta' },
    { numero: 2, titulo: 'Dados Básicos' },
    { numero: 3, titulo: 'Finalização' },
  ];

  return (
    <div className="progresso-container">
      {passos.map((passo, index) => {
        const concluido = passoAtual > passo.numero;
        const ativo = passoAtual === passo.numero;
        
        return (
          <React.Fragment key={passo.numero}>
            <div className="passo-item">
              <div className={`passo-circulo ${ativo ? 'ativo' : ''} ${concluido ? 'concluido' : ''}`}>
                {concluido ? (
                  <CheckIcon size={16} />
                ) : (
                  passo.numero
                )}
              </div>
              <div className={`passo-texto ${ativo ? 'ativo' : ''} ${concluido ? 'concluido' : ''}`}>
                {passo.titulo}
              </div>
            </div>
            
            {index < passos.length - 1 && (
              <div className={`passo-linha ${passoAtual > passo.numero + 1 ? 'concluido' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProgressoCadastro;