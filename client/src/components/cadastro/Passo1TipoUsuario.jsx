import React from 'react';
import { UserIcon, WrenchIcon } from 'lucide-react';
import styles from './Passo1TipoUsuario.module.css';

const Passo1TipoUsuario = ({ tipoSelecionado, onSelecionar, erro }) => {
  return (
    <div className={styles['passo-container']}>
      <h2 className={`${styles['titulo']} ${styles['mb-6']}`}>Escolha o tipo de conta</h2>
      
      <div className={styles['tipo-usuario-opcoes']}>
        <div 
          className={`${styles['tipo-card']} ${tipoSelecionado === 'usuario' ? styles['selecionado'] : ''}`}
          onClick={() => onSelecionar('usuario')}
        >
          <div className={`${styles['icone-container']} ${styles['usuario']}`}>
            <UserIcon size={40} />
          </div>
          <h3 className={`${styles['subtitulo']} ${styles['mt-3']}`}>Usuário Comum</h3>
          <p className={`${styles['descricao']} ${styles['mt-2']}`}>
            Procuro profissionais para realizar serviços técnicos
          </p>
        </div>
        
        <div 
          className={`${styles['tipo-card']} ${tipoSelecionado === 'prestador' ? styles['selecionado'] : ''}`}
          onClick={() => onSelecionar('prestador')}
        >
          <div className={`${styles['icone-container']} ${styles['prestador']}`}>
            <WrenchIcon size={40} />
          </div>
          <h3 className={`${styles['subtitulo']} ${styles['mt-3']}`}>Prestador de Serviço</h3>
          <p className={`${styles['descricao']} ${styles['mt-2']}`}>
            Ofereço serviços técnicos e busco novos clientes
          </p>
        </div>
      </div>
      
      {erro && <p className={`${styles['mensagem-erro']} ${styles['mt-4']} ${styles['text-center']}`}>{erro}</p>}
    </div>
  );
};

export default Passo1TipoUsuario;