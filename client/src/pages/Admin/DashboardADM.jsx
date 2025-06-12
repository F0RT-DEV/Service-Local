import React, { useEffect, useState } from "react";
import styles from "./DashboardADM.module.css";

const getToken = () => localStorage.getItem("token");

const DashboardADM = () => {
  const [aba, setAba] = useState("pendentes");
  const [pendentes, setPendentes] = useState([]);
  const [aprovados, setAprovados] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [mensagem, setMensagem] = useState("");

  // Carregar prestadores pendentes
  useEffect(() => {
    if (aba === "pendentes") {
      fetch("http://localhost:3333/admin/providers/pending", {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
        .then(res => res.json())
        .then(setPendentes)
        .catch(() => setPendentes([]));
    }
  }, [aba, mensagem]);

  // Carregar prestadores aprovados
  useEffect(() => {
    if (aba === "aprovados") {
      fetch("http://localhost:3333/admin/providers/approved", {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
        .then(res => res.json())
        .then(setAprovados)
        .catch(() => setAprovados([]));
    }
  }, [aba, mensagem]);

  // Carregar todos os usuários
  useEffect(() => {
    if (aba === "usuarios") {
      fetch("http://localhost:3333/admin/users", {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
        .then(res => res.json())
        .then(setUsuarios)
        .catch(() => setUsuarios([]));
    }
  }, [aba]);

  // Aprovar prestador
  const aprovarPrestador = async (id) => {
    setMensagem("");
    try {
      const res = await fetch(`http://localhost:3333/admin/${id}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      setMensagem(data.message || "Prestador aprovado com sucesso!");
    } catch {
      setMensagem("Erro ao aprovar prestador.");
    }
  };

  // Rejeitar prestador
  const rejeitarPrestador = async (id) => {
    setMensagem("");
    try {
      const res = await fetch(`http://localhost:3333/admin/${id}/reject`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      setMensagem(data.message || "Prestador rejeitado com sucesso!");
    } catch {
      setMensagem("Erro ao rejeitar prestador.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Painel do Administrador</h1>
      
      <div className={styles.tabContainer}>
        <button 
          onClick={() => setAba("pendentes")} 
          className={`${styles.tabButton} ${aba === "pendentes" ? styles.active : ""}`}
        >
          Prestadores Pendentes
        </button>
        <button 
          onClick={() => setAba("aprovados")} 
          className={`${styles.tabButton} ${aba === "aprovados" ? styles.active : ""}`}
        >
          Prestadores Aprovados
        </button>
        <button 
          onClick={() => setAba("usuarios")} 
          className={`${styles.tabButton} ${aba === "usuarios" ? styles.active : ""}`}
        >
          Usuários
        </button>
        <button 
          onClick={() => setAba("relatorios")} 
          className={`${styles.tabButton} ${aba === "relatorios" ? styles.active : ""}`}
        >
          Relatórios (em breve)
        </button>
      </div>

      {mensagem && (
        <div className={`${styles.message} ${
          mensagem.includes("sucesso") ? styles.success : styles.error
        }`}>
          {mensagem}
        </div>
      )}

      {aba === "pendentes" && (
        <div>
          <h2 className={styles.sectionTitle}>Prestadores Pendentes</h2>
          {pendentes.length === 0 ? (
            <p className={styles.emptyMessage}>Nenhum prestador pendente.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CNPJ</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pendentes.map((p) => (
                  <tr key={p.id}>
                    <td>{p.bio || "-"}</td>
                    <td>{p.cnpj || "-"}</td>
                    <td>{p.status}</td>
                    <td>
                      <button 
                        onClick={() => aprovarPrestador(p.id)} 
                        className={`${styles.actionButton} ${styles.approveButton}`}
                      >
                        Aprovar
                      </button>
                      <button 
                        onClick={() => rejeitarPrestador(p.id)}
                        className={`${styles.actionButton} ${styles.rejectButton}`}
                      >
                        Rejeitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {aba === "aprovados" && (
        <div>
          <h2 className={styles.sectionTitle}>Prestadores Aprovados</h2>
          {aprovados.length === 0 ? (
            <p className={styles.emptyMessage}>Nenhum prestador aprovado.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CNPJ</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {aprovados.map((p) => (
                  <tr key={p.id}>
                    <td>{p.bio || "-"}</td>
                    <td>{p.cnpj || "-"}</td>
                    <td>{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {aba === "usuarios" && (
        <div>
          <h2 className={styles.sectionTitle}>Todos os Usuários</h2>
          {usuarios.length === 0 ? (
            <p className={styles.emptyMessage}>Nenhum usuário encontrado.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Tipo</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone || "-"}</td>
                    <td>{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {aba === "relatorios" && (
        <div>
          <h2 className={styles.sectionTitle}>Relatórios e Moderação</h2>
          <p className={styles.emptyMessage}>Funcionalidade em desenvolvimento.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardADM;