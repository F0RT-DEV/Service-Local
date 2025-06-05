import React, { useState, useEffect } from 'react';
import styles from './DashboardPrestador.module.css';

const getUsuarioLocal = () => {
  try {
    const usuario = localStorage.getItem("usuario");
    return usuario ? JSON.parse(usuario) : null;
  } catch {
    return null;
  }
};

const DashboardPrestador = () => {
  const usuario = getUsuarioLocal();
  const [provider, setProvider] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    bio: "",
    cnpj: "",
    experiencia: "",
    categorias: [],
  });
  const [mensagem, setMensagem] = useState("");

  // Busca categorias disponíveis
  useEffect(() => {
    fetch('http://localhost:3333/categories')
      .then(res => res.json())
      .then(setCategorias)
      .catch(() => setCategorias([]));
  }, []);

  // Busca dados do provider logado
  useEffect(() => {
    if (usuario?.id) {
      fetch(`http://localhost:3333/providers?user_id=${usuario.id}`)
        .then(res => res.json())
        .then(data => {
          // Se o backend retornar um array, pegue o primeiro
          const prov = Array.isArray(data) ? data[0] : data;
          setProvider(prov);
          setForm({
            bio: prov?.bio || "",
            cnpj: prov?.cnpj || "",
            experiencia: prov?.experience || "",
            categorias: prov?.categories ? prov.categories.map(c => c.id) : [],
          });
        })
        .catch(() => setProvider(null));
    }
  }, [usuario]);

  // Atualiza campos do formulário
const handleChange = (e) => {
  const { name, value, checked } = e.target;
  if (name === "categorias") {
    let novasCategorias = [...form.categorias];
    if (checked) {
      novasCategorias.push(value);
    } else {
      novasCategorias = novasCategorias.filter(cat => cat !== value);
    }
    setForm({ ...form, categorias: novasCategorias });
  } else {
    setForm({ ...form, [name]: value });
  }
};

  // Salva alterações do perfil do prestador
  const handleSalvar = async (e) => {
    e.preventDefault();
    setMensagem("");
    try {
      const payload = {
        bio: form.bio,
        cnpj: form.cnpj,
        experience: form.experiencia,
        areas_of_expertise: form.categorias,
        status: provider?.status || "pending",
      };
      // Atualiza o provider pelo user_id
      const res = await fetch(`http://localhost:3333/providers/${usuario.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setMensagem("Perfil atualizado com sucesso!");
        setEditando(false);
        // Atualiza provider local
        setProvider({ ...provider, ...payload });
      } else {
        const erro = await res.json();
        setMensagem(erro.error || "Erro ao atualizar perfil.");
      }
    } catch (err) {
      setMensagem("Erro ao atualizar perfil.");
    }
  };

  if (!usuario) {
    return <div className={styles['dashboard-prestador']}>Faça login para acessar o painel do prestador.</div>;
  }

  if (!provider) {
    return <div className={styles['dashboard-prestador']}>Carregando dados do prestador...</div>;
  }

  return (
    <div className={styles['dashboard-prestador']}>
      <h1>Bem-vindo, {usuario.nome}!</h1>
      <h2>Perfil do Prestador</h2>
      {mensagem && <div className={styles['mensagem']}>{mensagem}</div>}
      {!editando ? (
        <div className={styles['perfil-dados']}>
          <p><strong>Bio:</strong> {provider.bio || "-"}</p>
          <p><strong>CNPJ:</strong> {provider.cnpj || "-"}</p>
          <p><strong>Status:</strong> {provider.status || "-"}</p>
          <p><strong>Experiência:</strong> {provider.experience || "-"}</p>
          <p><strong>Categorias:</strong> {provider.categories && provider.categories.length > 0
            ? provider.categories.map(cat => cat.name).join(", ")
            : "-"}</p>
          <button className={styles['btn-editar']} onClick={() => setEditando(true)}>Editar Perfil</button>
        </div>
      ) : (
        <form className={styles['perfil-form']} onSubmit={handleSalvar}>
          <div className={styles['form-group']}>
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="cnpj">CNPJ</label>
            <input
              id="cnpj"
              name="cnpj"
              type="text"
              value={form.cnpj}
              onChange={handleChange}
            />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="experiencia">Experiência</label>
            <input
              id="experiencia"
              name="experiencia"
              type="text"
              value={form.experiencia}
              onChange={handleChange}
            />
          </div>
          <div className={styles['form-group']}>
            <label>Categorias</label>
            <div className={styles['categorias-container']}>
              {categorias.map(cat => (
                <div key={cat.id} className={styles['categoria-option']}>
                  <input
                    type="checkbox"
                    id={`categoria-${cat.id}`}
                    name="categorias"
                    value={cat.id}
                    checked={form.categorias.includes(cat.id)}
                    onChange={handleChange}
                  />
                  <label htmlFor={`categoria-${cat.id}`}>{cat.name}</label>
                </div>
              ))}
            </div>
          </div>
          <div className={styles['perfil-actions']}>
            <button type="submit" className={styles['btn-salvar']}>Salvar</button>
            <button type="button" className={styles['btn-cancelar']} onClick={() => setEditando(false)}>Cancelar</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default DashboardPrestador;