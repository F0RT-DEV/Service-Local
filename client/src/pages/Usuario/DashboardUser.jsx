import React, { useEffect, useState } from 'react';
import styles from './DashboardUser.module.css';

const DashboardUser = () => {
  const [servicos, setServicos] = useState([]);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/servicos')
      .then(res => res.json())
      .then(data => setServicos(data))
      .catch(() => setServicos([]));
  }, []);

  const handleVerDetalhes = (servico) => {
    setServicoSelecionado(servico);
  };

  const fecharDetalhes = () => {
    setServicoSelecionado(null);
  };

  const handleSolicitarServico = (servico) => {
    alert(`Solicitação enviada para o serviço: ${servico.nome}`);
  };

  return (
    <div className={styles['dashboard-user']}>
      <h1>Bem-vindo à sua área de usuário!</h1>
      <h2>Serviços disponíveis</h2>
      <div className={styles['servicos-lista']}>
        {servicos.length === 0 ? (
          <p>Nenhum serviço disponível.</p>
        ) : (
          servicos.map((servico) => (
            <div key={servico.id} className={styles['servico-card']}>
              <img
                src={servico.imagem || 'https://via.placeholder.com/120x80?text=Serviço'}
                alt={servico.nome}
                className={styles['servico-imagem']}
              />
              <div className={styles['servico-info']}>
                <h3>{servico.nome}</h3>
                <p><strong>Área:</strong> {servico.area}</p>
                <p><strong>Descrição:</strong> {servico.descricao}</p>
                <p><strong>Experiência:</strong> {servico.experiencia}</p>
              </div>
              <div className={styles['servico-actions']}>
                <button
                  className={styles['btn-detalhes']}
                  onClick={() => handleVerDetalhes(servico)}
                >
                  Ver detalhes
                </button>
                <button
                  className={styles['btn-solicitar']}
                  onClick={() => handleSolicitarServico(servico)}
                >
                  Solicitar serviço
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {servicoSelecionado && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal']}>
            <img
              src={servicoSelecionado.imagem || 'https://via.placeholder.com/120x80?text=Serviço'}
              alt={servicoSelecionado.nome}
              className={styles['servico-imagem']}
            />
            <h2>{servicoSelecionado.nome}</h2>
            <p><strong>Área:</strong> {servicoSelecionado.area}</p>
            <p><strong>Descrição:</strong> {servicoSelecionado.descricao}</p>
            <p><strong>Experiência:</strong> {servicoSelecionado.experiencia}</p>
            <p><strong>Região:</strong> {servicoSelecionado.regiao}</p>
            <p><strong>Valor:</strong> R$ {servicoSelecionado.valor}</p>
            <button onClick={fecharDetalhes} className={styles['btn-cancelar']}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardUser;