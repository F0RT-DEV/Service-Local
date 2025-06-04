import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AutenticacaoLocal";
import styles from './DashboardUser.module.css';

const DashboardUser = () => {
  const { usuario } = useAuth();
  const [servicos, setServicos] = useState([]);
  const [ordens, setOrdens] = useState([]);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [aba, setAba] = useState("ordens"); // "ordens" ou "servicos"

  // Carrega todos os serviços disponíveis
  useEffect(() => {
    fetch("http://localhost:5000/servicos")
      .then(res => res.json())
      .then(setServicos)
      .catch(() => setServicos([]));
  }, []);

  // Carrega ordens do usuário
  useEffect(() => {
    if (usuario?.id) {
      fetch(`http://localhost:5000/ordensServico?clienteId=${usuario.id}`)
        .then(res => res.json())
        .then(setOrdens);
    }
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
    fetch("http://localhost:5000/ordensServico", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaOS)
    })
      .then(res => res.json())
      .then(osCriada => {
        setOrdens([...ordens, osCriada]);
        setMensagem("");
        alert("Ordem de serviço criada!");
        setServicoSelecionado(null);
        setAba("ordens"); // Volta para aba de ordens
      });
  };

  // Visualizar detalhes do serviço
  const handleVerDetalhes = (servico) => {
    setServicoSelecionado(servico);
  };

  const fecharDetalhes = () => setServicoSelecionado(null);

  // Função para mostrar o nome do serviço na tabela de OS
  const getNomeServico = (servicoId) => {
    const servico = servicos.find(s => s.id === servicoId);
    return servico ? servico.nome : servicoId;
  };

  // Sugestão de conteúdo extra para preencher a tela de ordens
  const totalOrdens = ordens.length;
  const ordensPendentes = ordens.filter(os => os.status === "pendente").length;
  const ordensConcluidas = ordens.filter(os => os.status === "concluída").length;

  return (
    <div className={styles['dashboard-user']}>
      <h1>Bem-vindo à sua área de usuário!</h1>
      <div className={styles['tabs']}>
        <button
          className={aba === "ordens" ? styles['tab-active'] : styles['tab']}
          onClick={() => setAba("ordens")}
        >
          Minhas Ordens de Serviço
        </button>
        <button
          className={aba === "servicos" ? styles['tab-active'] : styles['tab']}
          onClick={() => setAba("servicos")}
        >
          Serviços Disponíveis
        </button>
      </div>

      {aba === "ordens" && (
        <>
          <div className={styles['resumo-ordens']}>
            <div>Total de Ordens: <b>{totalOrdens}</b></div>
            <div>Pendentes: <b>{ordensPendentes}</b></div>
            <div>Concluídas: <b>{ordensConcluidas}</b></div>
          </div>
          <h2>Minhas Ordens de Serviço</h2>
          <div className={styles['ordens-container']}>
            {ordens.length === 0 ? (
              <p>Nenhuma ordem de serviço encontrada.</p>
            ) : (
              <table className={styles['ordens-tabela']}>
                <thead>
                  <tr>
                    <th>Serviço</th>
                    <th>Status</th>
                    <th>Data</th>
                    <th>Mensagem</th>
                  </tr>
                </thead>
                <tbody>
                  {ordens.map(os => (
                    <tr key={os.id}>
                      <td>{getNomeServico(os.servicoId)}</td>
                      <td><b>{os.status}</b></td>
                      <td>{new Date(os.dataSolicitacao).toLocaleString()}</td>
                      <td>{os.mensagem}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

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
        </>
      )}

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