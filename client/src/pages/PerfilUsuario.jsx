import React, { useState, useEffect } from 'react';
import styles from './PerfilUsuario.module.css';

const getUsuarioLocal = () => {
  try {
    const usuario = localStorage.getItem("usuario");
    return usuario ? JSON.parse(usuario) : null;
  } catch {
    return null;
  }
};

const PerfilUsuario = () => {
  const usuario = getUsuarioLocal();
  const [dados, setDados] = useState(usuario);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState(usuario || {});

  useEffect(() => {
    setDados(usuario);
    setForm(usuario);
  }, []);

  if (!dados) return <div>Carregando...</div>;

  const tipoFormatado = dados.role === 'client'
    ? 'Usuário Comum'
    : dados.role === 'provider'
      ? 'Prestador de Serviço'
      : dados.role;

  const handleSalvar = async (e) => {
    e.preventDefault();
    // Atualiza no backend (ajuste a rota e método conforme seu backend real)
    // Exemplo:
    // const res = await fetch(`http://localhost:3333/users/${dados.id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(form)
    // });
    // if (res.ok) {
    //   localStorage.setItem("usuario", JSON.stringify(form));
    //   setEditando(false);
    //   window.location.reload();
    // }
    setEditando(false);
    setDados(form);
    localStorage.setItem("usuario", JSON.stringify(form));
  };

  return (
    <div className={styles['perfil-container']}>
      <h2>Meu Perfil</h2>
      {!editando ? (
        <div className={styles['perfil-dados']}>
          <p><strong>Nome:</strong> {dados.nome}</p>
          <p><strong>Email:</strong> {dados.email}</p>
          <p><strong>Telefone:</strong> {dados.telefone}</p>
          <p><strong>CPF:</strong> {dados.cpf}</p>
          <p><strong>CNPJ:</strong> {dados.cnpj}</p>
          <p><strong>Endereço:</strong> {dados.rua}, {dados.numero} {dados.complemento && `- ${dados.complemento}`}</p>
          <p><strong>CEP:</strong> {dados.cep}</p>
          <p><strong>Cidade:</strong> {dados.cidade}</p>
          <p><strong>Estado:</strong> {dados.estado}</p>
          <p><strong>Tipo de Conta:</strong> {tipoFormatado}</p>
          <button className={styles['btn-editar']} onClick={() => setEditando(true)}>Editar Perfil</button>
        </div>
      ) : (
        <form className={styles['perfil-form']} onSubmit={handleSalvar}>
          {/* ...campos iguais... */}
          <div className={styles['perfil-actions']}>
            <button type="submit" className={styles['btn-salvar']}>Salvar</button>
            <button type="button" className={styles['btn-cancelar']} onClick={() => setEditando(false)}>Cancelar</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PerfilUsuario;