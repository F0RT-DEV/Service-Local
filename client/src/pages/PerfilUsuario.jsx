import React, { useState, useEffect } from 'react';
import axios from "axios";
import styles from './PerfilUsuario.module.css';

const PerfilUsuario = () => {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  // Busca dados completos do usuário autenticado no backend ao montar
  useEffect(() => {
  async function fetchDados() {
    const token = localStorage.getItem("token");
    console.log("TOKEN ENCONTRADO NO PERFIL:", token); // LOG PARA DEPURAÇÃO
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get("http://localhost:3333/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        setDados({
          ...res.data.user,
          ...(res.data.provider ? { provider: res.data.provider } : {})
        });
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
       
      }
    }
    setLoading(false);
  }
  fetchDados();
}, []);

  if (loading) return <div>Carregando...</div>;
  if (!dados) return <div>Usuário não encontrado.</div>;

const tipoFormatado = dados.role === 'client'
  ? 'Usuário Comum'
  : dados.role === 'provider'
    ? 'Prestador de Serviço'
    : dados.role;

  return (
    <div className={styles['perfil-container']}>
      <h2>Meu Perfil</h2>
      <div className={styles['perfil-dados']}>
        <p><strong>Nome:</strong> {dados.name}</p>
        <p><strong>Email:</strong> {dados.email}</p>
        <p><strong>Telefone:</strong> {dados.phone}</p>
        <p><strong>CPF:</strong> {dados.cpf || '-'}</p>
        <p><strong>CNPJ:</strong> {dados.cnpj || '-'}</p>
        <p><strong>Endereço:</strong> {dados.logradouro || '-'}, {dados.numero || '-'} {dados.complemento && `- ${dados.complemento}`}</p>
        <p><strong>Bairro:</strong> {dados.bairro || '-'}</p>
        <p><strong>CEP:</strong> {dados.cep || '-'}</p>
        <p><strong>Cidade:</strong> {dados.localidade || '-'}</p>
        <p><strong>Estado:</strong> {dados.uf || '-'}</p>
        <p><strong>Tipo de Conta:</strong> {tipoFormatado}</p>
        {dados.provider && (
          <>
            <p><strong>Status do Prestador:</strong> {dados.provider.status}</p>
            <p><strong>Bio:</strong> {dados.provider.bio || '-'}</p>
          </>
        )}
      </div>
      {/* Botão de editar pode ser habilitado quando a rota de update existir */}
      {/* <button className={styles['btn-editar']} disabled>Editar Perfil</button> */}
    </div>
  );
};

export default PerfilUsuario;