import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AutenticacaoLocal';
import styles from './PerfilUsuario.module.css';

const PerfilUsuario = () => {
  const { usuario, setFeedback } = useAuth();
  const [dados, setDados] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    setDados(usuario);
    setForm(usuario);
  }, [usuario]);

  if (!dados) return <div>Carregando...</div>;

  const tipoFormatado = dados.tipo === 'usuario'
    ? 'Usuário Comum'
    : dados.tipo === 'prestador'
      ? 'Prestador de Serviço'
      : dados.tipo;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    // Atualiza no backend
    const res = await fetch(`http://localhost:5000/usuarios/${dados.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setFeedback('Perfil atualizado com sucesso!');
      setEditando(false);
      // Atualiza localmente (opcional: recarregar usuário do backend)
      window.location.reload();
    } else {
      setFeedback('Erro ao atualizar perfil.');
    }
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
          <label>
            Nome:
            <input name="nome" value={form.nome || ''} onChange={handleChange} />
          </label>
          <label>
            Email:
            <input name="email" value={form.email || ''} onChange={handleChange} />
          </label>
          <label>
            Telefone:
            <input name="telefone" value={form.telefone || ''} onChange={handleChange} />
          </label>
          <label>
            CPF:
            <input name="cpf" value={form.cpf || ''} onChange={handleChange} />
          </label>
          <label>
            CNPJ:
            <input name="cnpj" value={form.cnpj || ''} onChange={handleChange} />
          </label>
          <label>
            Rua:
            <input name="rua" value={form.rua || ''} onChange={handleChange} />
          </label>
          <label>
            Número:
            <input name="numero" value={form.numero || ''} onChange={handleChange} />
          </label>
          <label>
            Complemento:
            <input name="complemento" value={form.complemento || ''} onChange={handleChange} />
          </label>
          <label>
            CEP:
            <input name="cep" value={form.cep || ''} onChange={handleChange} />
          </label>
          <label>
            Cidade:
            <input name="cidade" value={form.cidade || ''} onChange={handleChange} />
          </label>
          <label>
            Estado:
            <input name="estado" value={form.estado || ''} onChange={handleChange} />
          </label>
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