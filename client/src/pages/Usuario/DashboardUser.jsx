import React, { useState, useEffect } from "react";
import styles from './DashboardUser.module.css';

const getUsuarioLocal = () => {
  try {
    const usuario = localStorage.getItem("usuario");
    return usuario ? JSON.parse(usuario) : null;
  } catch {
    return null;
  }
};

const DashboardUser = () => {
  const usuario = getUsuarioLocal();
  const [servicos, setServicos] = useState([]);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [mensagem, setMensagem] = useState("");

  // Carrega todos os serviços disponíveis
  useEffect(() => {
    fetch("http://localhost:3333/servicos")
      .then(res => res.json())
      .then(setServicos)
      .catch(() => setServicos([]));
  }, []);

  // Solicitar novo serviço (criar OS)
  const handleSolicitarServico = (servico) => {
    if (!usuario?.id) return;
    const novaOS = {
      clienteId: usuario.id,
      prestadorId: servico.prestadorId,
      servicoId: servico.id,
      status: "pendente",
      dataSolicitacao: new Date().toISOString(),
      mensagem: mensagem || "Solicitação automática"
    };
    fetch("http://localhost:3333/ordensServico", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaOS)
    })
      .then(res => res.json())
      .then(() => {
        setMensagem("");
        alert("Ordem de serviço criada!");
        setServicoSelecionado(null);
      });
  };

  // Visualizar detalhes do serviço
  const handleVerDetalhes = (servico) => {
    setServicoSelecionado(servico);
  };

  const fecharDetalhes = () => setServicoSelecionado(null);

  return (
    <div className={styles['dashboard-user']}>
      <h1>Bem-vindo à sua área de usuário!</h1>
      <div className={styles['tabs']}>
        <button className={styles['tab-active']}>
          Serviços Disponíveis
        </button>
      </div>

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
            <label>Mensagem para o prestador:</label>
            <input
              type="text"
              value={mensagem}
              onChange={e => setMensagem(e.target.value)}
              placeholder="Mensagem opcional"
              className={styles['input-mensagem']}
            />
            <div className={styles['modal-actions']}>
              <button
                onClick={() => handleSolicitarServico(servicoSelecionado)}
                className={styles['btn-solicitar']}
              >
                Solicitar Serviço
              </button>
              <button onClick={fecharDetalhes} className={styles['btn-cancelar']}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardUser;