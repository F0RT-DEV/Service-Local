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

  // Paginação e filtros
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const servicosPorPagina = 12;
  
  // Filtra serviços por categoria
  const servicosFiltrados = filtroCategoria === "todas" 
    ? servicos 
    : servicos.filter(servico => servico.category_id === filtroCategoria);
  
  // Calcula paginação com os serviços filtrados
  const indiceUltimo = paginaAtual * servicosPorPagina;
  const indicePrimeiro = indiceUltimo - servicosPorPagina;
  const servicosPagina = servicosFiltrados.slice(indicePrimeiro, indiceUltimo);
  const totalPaginas = Math.ceil(servicosFiltrados.length / servicosPorPagina);

  // Extrai categorias únicas para o filtro
  const categorias = ["todas", ...new Set(servicos.map(servico => servico.category_id))];

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
    fetch(`http://localhost:3333/clients/orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(setOrdens)
      .catch(() => setOrdens([]));
  }, [usuario?.id]);

  const handleSolicitarServico = (servico) => {
    if (!usuario?.id) {
      alert("Usuário não autenticado.");
      return;
    }

    const novaOS = {
      service_id: servico.id,
      scheduled_date: new Date().toISOString(),
      mensagem: mensagem || "Solicitação automática",
    };

    console.log("Dados enviados:", novaOS);

    fetch("http://localhost:3333/clients/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(novaOS),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => {
            throw new Error(error.message || "Erro ao criar ordem de serviço");
          });
        }
        return res.json();
      })
      .then(() => {
        setMensagem("");
        alert("Ordem de serviço criada!");
        setServicoSelecionado(null);
        fetch(`http://localhost:3333/clients/orders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((res) => res.json())
          .then(setOrdens);
      })
      .catch((error) => {
        console.error("Erro:", error.message);
        alert(`Erro: ${error.message}`);
      });
  };

  const handleEnviarAvaliacao = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3333/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        order_id: avaliarOS.id,
        provider_id: avaliarOS.provider_id,
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
        fetch(`http://localhost:3333/clients/orders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
          .then(res => res.json())
          .then(setOrdens);
      });
  };

  const handleVerDetalhes = (servico) => {
    setServicoSelecionado(servico);
  };

  const fecharDetalhes = () => setServicoSelecionado(null);

  const handlePagamento = (ordem) => {
    fetch(`http://localhost:3333/clients/orders/${ordem.id}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ status: "in_progress" })
    })
      .then(res => res.json())
      .then(() => {
        alert("Pagamento realizado! Serviço em andamento.");
        fetch(`http://localhost:3333/clients/orders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
          .then(res => res.json())
          .then(setOrdens);
      });
  };

  const renderPaginacao = () => {
    if (totalPaginas <= 1) return null;
    
    const paginasVisiveis = 5;
    let inicio = Math.max(1, paginaAtual - Math.floor(paginasVisiveis / 2));
    let fim = Math.min(totalPaginas, inicio + paginasVisiveis - 1);
    
    if (fim - inicio + 1 < paginasVisiveis) {
      inicio = Math.max(1, fim - paginasVisiveis + 1);
    }

    return (
      <div className={styles.paginacaoContainer}>
        <button 
          onClick={() => setPaginaAtual(1)} 
          disabled={paginaAtual === 1}
          className={styles.botaoPagina}
        >
          «
        </button>
        <button 
          onClick={() => setPaginaAtual(p => Math.max(1, p - 1))} 
          disabled={paginaAtual === 1}
          className={styles.botaoPagina}
        >
          ‹
        </button>
        
        {inicio > 1 && <span className={styles.pontos}>...</span>}
        
        {Array.from({ length: fim - inicio + 1 }, (_, i) => inicio + i).map(num => (
          <button
            key={num}
            onClick={() => setPaginaAtual(num)}
            className={`${styles.botaoPagina} ${paginaAtual === num ? styles.paginaAtiva : ''}`}
          >
            {num}
          </button>
        ))}
        
        {fim < totalPaginas && <span className={styles.pontos}>...</span>}
        
        <button 
          onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))} 
          disabled={paginaAtual === totalPaginas}
          className={styles.botaoPagina}
        >
          ›
        </button>
        <button 
          onClick={() => setPaginaAtual(totalPaginas)} 
          disabled={paginaAtual === totalPaginas}
          className={styles.botaoPagina}
        >
          »
        </button>
      </div>
    );
  };

  useEffect(() => {
    if (aba === "servicos") setPaginaAtual(1);
  }, [aba, filtroCategoria]);

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
          <div className={styles.cabecalhoServicos}>
            <h2>Serviços disponíveis</h2>
            <div className={styles.filtros}>
              <label>Filtrar por categoria:</label>
              <select 
                value={filtroCategoria} 
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className={styles.selectFiltro}
              >
                {categorias.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === "todas" ? "Todas as categorias" : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className={styles['servicos-lista']}>
            {servicosPagina.length === 0 ? (
              <p className={styles.semResultados}>Nenhum serviço encontrado com os filtros selecionados.</p>
            ) : (
              servicosPagina.map((servico) => (
                <div key={servico.id} className={styles['servico-card']}>
                  <div className={styles['servico-imagem-container']}>
                    <img
                      src={
                        servico.images && typeof servico.images === "string"
                          ? servico.images.split(',')[0]
                          : 'https://via.placeholder.com/120x80?text=Serviço'
                      }
                      alt={servico.title}
                      className={styles['servico-imagem']}
                    />
                  </div>
                  <div className={styles['servico-info']}>
                    <h3>{servico.title}</h3>
                    <p className={styles['servico-descricao']}>{servico.description}</p>
                    <div className={styles['servico-metadados']}>
                      <span><strong>Valor:</strong> R$ {servico.price_min} - R$ {servico.price_max}</span>
                      <span><strong>Categoria:</strong> {servico.category_id}</span>
                    </div>
                  </div>
                  <div className={styles['servico-actions']}>
                    <button
                      className={styles['btn-detalhes']}
                      onClick={() => handleVerDetalhes(servico)}
                    >
                      Ver detalhes
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {renderPaginacao()}
          
          <div className={styles.infoPaginacao}>
            Mostrando {servicosPagina.length} de {servicosFiltrados.length} serviços
            {filtroCategoria !== "todas" && ` na categoria "${filtroCategoria}"`}
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
                  <div className={styles['ordem-info']}>
                    <h3>{ordem.servicoTitulo}</h3>
                    <div className={styles['ordem-metadados']}>
                      <span className={`${styles.status} ${styles[`status-${ordem.status}`]}`}>
                        {ordem.status === "pending" && "Aguardando aprovação"}
                        {ordem.status === "accepted" && "Solicitação aprovada"}
                        {ordem.status === "rejected" && "Solicitação rejeitada"}
                        {ordem.status === "in_progress" && "Em andamento"}
                        {ordem.status === "completed" && "Finalizada"}
                      </span>
                      <span>Prestador: {ordem.prestadorNome}</span>
                      <span>Data: {new Date(ordem.scheduled_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className={styles['ordem-actions']}>
                    {ordem.status === "accepted" && (
                      <button
                        className={styles.btnPagamento}
                        onClick={() => handlePagamento(ordem)}
                      >
                        Realizar Pagamento
                      </button>
                    )}
                    {ordem.status === "in_progress" && !ordem.avaliada && (
                      <button
                        onClick={() => setAvaliarOS(ordem)}
                        className={styles.btnAvaliar}
                      >
                        Avaliar Atendimento
                      </button>
                    )}
                    {ordem.status === "completed" && ordem.avaliada && (
                      <span className={styles.avaliacaoEnviada}>✅ Avaliação enviada</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {servicoSelecionado && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal']}>
            <button onClick={fecharDetalhes} className={styles['btn-fechar-modal']}>×</button>
            <div className={styles['modal-content']}>
              <div className={styles['modal-imagem-container']}>
                <img
                  src={
                    servicoSelecionado.images && typeof servicoSelecionado.images === "string"
                      ? servicoSelecionado.images.split(',')[0]
                      : 'https://via.placeholder.com/120x80?text=Serviço'
                  }
                  alt={servicoSelecionado.title}
                  className={styles['modal-imagem']}
                />
              </div>
              <div className={styles['modal-info']}>
                <h2>{servicoSelecionado.title}</h2>
                <p className={styles['modal-descricao']}>{servicoSelecionado.description}</p>
                <div className={styles['modal-detalhes']}>
                  <div>
                    <strong>Valor:</strong> R$ {servicoSelecionado.price_min} - R$ {servicoSelecionado.price_max}
                  </div>
                  <div>
                    <strong>Categoria:</strong> {servicoSelecionado.category_id}
                  </div>
                </div>
                <label className={styles['modal-label']}>Mensagem para o prestador:</label>
                <textarea
                  value={mensagem}
                  onChange={e => setMensagem(e.target.value)}
                  placeholder="Mensagem opcional"
                  className={styles['modal-textarea']}
                  rows={3}
                />
              </div>
            </div>
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

      {avaliarOS && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal']}>
            <button onClick={() => setAvaliarOS(null)} className={styles['btn-fechar-modal']}>×</button>
            <h2>Avaliar Atendimento</h2>
            <div className={styles['avaliacao-content']}>
              <div className={styles['avaliacao-info']}>
                <h3>{avaliarOS.servicoTitulo}</h3>
                <p>Prestador: {avaliarOS.prestadorNome}</p>
              </div>
              
              <div className={styles['avaliacao-form']}>
                <div className={styles['avaliacao-campo']}>
                  <label>Nota:</label>
                  <div className={styles['avaliacao-estrelas']}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span 
                        key={n} 
                        onClick={() => setNota(n)}
                        className={n <= nota ? styles.estrelaAtiva : styles.estrela}
                      >
                        {n <= nota ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className={styles['avaliacao-campo']}>
                  <label>Comentário:</label>
                  <textarea
                    value={comentario}
                    onChange={e => setComentario(e.target.value)}
                    rows={4}
                    placeholder="Conte como foi sua experiência..."
                    className={styles['avaliacao-textarea']}
                  />
                </div>
              </div>
            </div>
            
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