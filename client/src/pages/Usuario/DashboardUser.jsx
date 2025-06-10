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
  const [aba, setAba] = useState("servicos");
  const [servicos, setServicos] = useState([]);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [ordens, setOrdens] = useState([]);
  const [avaliarOS, setAvaliarOS] = useState(null);
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState("");

  // Carrega todos os serviços disponíveis
  useEffect(() => {
    fetch("http://localhost:3333/services")
      .then(res => res.json())
      .then(setServicos)
      .catch(() => setServicos([]));
  }, []);

  // Carrega ordens de serviço do usuário
  useEffect(() => {
    if (!usuario?.id) return;
    fetch(`http://localhost:3333/ordensServico?clienteId=${usuario.id}`)
      .then(res => res.json())
      .then(setOrdens)
      .catch(() => setOrdens([]));
  }, [usuario?.id]);

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

  // Avaliar atendimento ao final da OS
  const handleEnviarAvaliacao = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3333/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        order_id: avaliarOS.id,
        provider_id: avaliarOS.prestadorId,
        rating: nota,
        comment: comentario,
      }),
    })
      .then(res => res.json())
      .then(() => {
        alert("Avaliação enviada!");
        setAvaliarOS(null);
        setNota(5);
        setComentario("");
        // Atualiza ordens para refletir avaliação
        fetch(`http://localhost:3333/ordensServico?clienteId=${usuario.id}`)
          .then(res => res.json())
          .then(setOrdens);
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
        <button
          className={aba === "servicos" ? styles['tab-active'] : ""}
          onClick={() => setAba("servicos")}
        >
          Serviços Disponíveis
        </button>
        <button
          className={aba === "ordens" ? styles['tab-active'] : ""}
          onClick={() => setAba("ordens")}
        >
          Minhas Ordens
        </button>
      </div>

      {aba === "servicos" && (
        <>
          <h2>Serviços disponíveis</h2>
          <div className={styles['servicos-lista']}>
            {servicos.length === 0 ? (
              <p>Nenhum serviço disponível.</p>
            ) : (
              servicos.map((servico) => (
                <div key={servico.id} className={styles['servico-card']}>
                  <img
                    src={
                      servico.images && typeof servico.images === "string"
                        ? servico.images.split(',')[0]
                        : 'https://via.placeholder.com/120x80?text=Serviço'
                    }
                    alt={servico.title}
                    className={styles['servico-imagem']}
                  />
                  <div className={styles['servico-info']}>
                    <h3>{servico.title}</h3>
                    <p><strong>Descrição:</strong> {servico.description}</p>
                    <p><strong>Valor:</strong> R$ {servico.price_min} - R$ {servico.price_max}</p>
                    <p><strong>Categoria:</strong> {servico.category_id}</p>
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
        </>
      )}

      {aba === "ordens" && (
        <>
          <h2>Minhas Ordens de Serviço</h2>
          <div className={styles['ordens-lista']}>
            {ordens.length === 0 ? (
              <p>Você ainda não solicitou nenhum serviço.</p>
            ) : (
              ordens.map(ordem => (
                <div key={ordem.id} className={styles['ordem-card']}>
                  <p><strong>Serviço:</strong> {ordem.servicoTitulo}</p>
                  <p><strong>Status:</strong> {ordem.status}</p>
                  <p><strong>Prestador:</strong> {ordem.prestadorNome}</p>
                  {/* Só permite avaliar se finalizada e ainda não avaliada */}
                  {ordem.status === "finalizada" && !ordem.avaliada && (
                    <button onClick={() => setAvaliarOS(ordem)}>
                      Avaliar Atendimento
                    </button>
                  )}
                  {ordem.status === "finalizada" && ordem.avaliada && (
                    <span>✅ Avaliação enviada</span>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Modal de detalhes do serviço */}
      {servicoSelecionado && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal']}>
            <img
              src={
                servicoSelecionado.images && typeof servicoSelecionado.images === "string"
                  ? servicoSelecionado.images.split(',')[0]
                  : 'https://via.placeholder.com/120x80?text=Serviço'
              }
              alt={servicoSelecionado.title}
              className={styles['servico-imagem']}
            />
            <h2>{servicoSelecionado.title}</h2>
            <p><strong>Descrição:</strong> {servicoSelecionado.description}</p>
            <p><strong>Valor:</strong> R$ {servicoSelecionado.price_min} - R$ {servicoSelecionado.price_max}</p>
            <p><strong>Categoria:</strong> {servicoSelecionado.category_id}</p>
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

      {/* Modal de avaliação */}
      {avaliarOS && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal']}>
            <h2>Avaliar Atendimento</h2>
            <label>Nota:</label>
            <select value={nota} onChange={e => setNota(Number(e.target.value))}>
              {[5, 4, 3, 2, 1].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <label>Comentário:</label>
            <textarea
              value={comentario}
              onChange={e => setComentario(e.target.value)}
              rows={3}
              placeholder="Deixe seu comentário"
            />
            <div className={styles['modal-actions']}>
              <button onClick={handleEnviarAvaliacao} className={styles['btn-solicitar']}>
                Enviar Avaliação
              </button>
              <button onClick={() => setAvaliarOS(null)} className={styles['btn-cancelar']}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardUser;