import React, { useEffect, useState } from "react";

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
      setMensagem(data.message || "Prestador aprovado!");
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
      setMensagem(data.message || "Prestador rejeitado!");
    } catch {
      setMensagem("Erro ao rejeitar prestador.");
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>Painel do Administrador</h1>
      <div style={{ marginBottom: 24 }}>
        <button onClick={() => setAba("pendentes")} style={{ marginRight: 8 }}>
          Prestadores Pendentes
        </button>
        <button onClick={() => setAba("aprovados")} style={{ marginRight: 8 }}>
          Prestadores Aprovados
        </button>
        <button onClick={() => setAba("usuarios")} style={{ marginRight: 8 }}>
          Usuários
        </button>
        <button onClick={() => setAba("relatorios")}>
          Relatórios (em breve)
        </button>
      </div>

      {mensagem && (
        <div style={{ marginBottom: 16, color: mensagem.includes("sucesso") ? "green" : "red" }}>
          {mensagem}
        </div>
      )}

      {aba === "pendentes" && (
        <div>
          <h2>Prestadores Pendentes</h2>
          {pendentes.length === 0 ? (
            <p>Nenhum prestador pendente.</p>
          ) : (
            <table border={1} cellPadding={8}>
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
                      <button onClick={() => aprovarPrestador(p.id)} style={{ marginRight: 8 }}>
                        Aprovar
                      </button>
                      <button onClick={() => rejeitarPrestador(p.id)}>
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
          <h2>Prestadores Aprovados</h2>
          {aprovados.length === 0 ? (
            <p>Nenhum prestador aprovado.</p>
          ) : (
            <table border={1} cellPadding={8}>
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
          <h2>Todos os Usuários</h2>
          {usuarios.length === 0 ? (
            <p>Nenhum usuário encontrado.</p>
          ) : (
            <table border={1} cellPadding={8}>
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
          <h2>Relatórios e Moderação</h2>
          <p>Funcionalidade em desenvolvimento.</p>
          {/* Aqui você pode implementar gráficos, relatórios, moderação de avaliações, etc */}
        </div>
      )}
    </div>
  );
};

export default DashboardADM;