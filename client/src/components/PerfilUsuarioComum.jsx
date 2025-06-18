import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./PerfilUsuarioComum.module.css";

const PerfilUsuarioComum = () => {
  const [dados, setDados] = useState(null);
  const [ordens, setOrdens] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3333/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDados(res.data.user))
      .catch((err) => console.error("Erro ao buscar dados do usuário:", err));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3333/clients/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrdens(res.data))
      .catch((err) => console.error("Erro ao buscar ordens de serviço:", err));
  }, []);

  if (!dados) return <div>Carregando...</div>;

  return (
    <div className={styles.perfilContainer}>
      <h2>Perfil do Usuário</h2>
      <div className={styles.perfilDados}>
        <p><strong>Nome:</strong> {dados.name}</p>
        <p><strong>Email:</strong> {dados.email}</p>
        <p><strong>Telefone:</strong> {dados.phone}</p>
        <p><strong>CPF:</strong> {dados.cpf || "-"}</p>
        <p><strong>Endereço:</strong> {dados.logradouro || "-"}, {dados.numero || "-"} {dados.complemento && `- ${dados.complemento}`}</p>
        <p><strong>Bairro:</strong> {dados.bairro || "-"}</p>
        <p><strong>CEP:</strong> {dados.cep || "-"}</p>
        <p><strong>Cidade:</strong> {dados.localidade || "-"}</p>
        <p><strong>Estado:</strong> {dados.uf || "-"}</p>
      </div>

      <h3>Histórico de Ordens</h3>
      <div>
        {ordens.length === 0 ? (
          <p>Nenhuma ordem encontrada.</p>
        ) : (
          ordens.map((ordem) => (
            <div key={ordem.id} className={styles.ordemCard}>
              <p><strong>Serviço:</strong> {ordem.servicoTitulo}</p>
              <p><strong>Status:</strong> {ordem.status}</p>
              <p><strong>Prestador:</strong> {ordem.prestadorNome}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PerfilUsuarioComum;