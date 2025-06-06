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
  // Estados
  const usuario = getUsuarioLocal();
  const [abaAtual, setAbaAtual] = useState("perfil");
  const [provider, setProvider] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [editando, setEditando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const [form, setForm] = useState({
    bio: "",
    cnpj: "",
    experiencia: "",
    categorias: [],
  });

  const [novoServico, setNovoServico] = useState({
    titulo: "",
    descricao: "",
    preco: ""
  });

  const [servicosPrestador, setServicosPrestador] = useState([]);

  // Efeitos
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('http://localhost:3333/categories');
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        setCategorias([]);
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    const fetchProviderData = async () => {
      if (!usuario?.id) return;
      
      try {
        const response = await fetch(`http://localhost:3333/providers?user_id=${usuario.id}`);
        const data = await response.json();
        
        const prov = Array.isArray(data) ? data[0] : data;
        setProvider(prov);
        
        setForm({
          bio: prov?.bio || "",
          cnpj: prov?.cnpj || "",
          experiencia: prov?.experience || "",
          categorias: prov?.categories ? prov.categories.map(c => c.id) : [],
        });
      } catch (error) {
        setProvider(null);
      }
    };

    fetchProviderData();
  }, [usuario]);

  // Buscar serviços do prestador ao carregar a aba
  useEffect(() => {
    if (abaAtual === "cadastrar-servico" && provider?.id) {
      fetch(`http://localhost:3333/servicos?provider_id=${provider.id}`)
        .then(res => res.json())
        .then(setServicosPrestador)
        .catch(() => setServicosPrestador([]));
    }
  }, [abaAtual, provider?.id]);

  // Handlers
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    
    if (name === "categorias") {
      const novasCategorias = checked
        ? [...form.categorias, value]
        : form.categorias.filter(cat => cat !== value);
      
      setForm(prev => ({ ...prev, categorias: novasCategorias }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

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

      const response = await fetch(`http://localhost:3333/providers/${usuario.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.error || "Erro ao atualizar perfil.");
      }

      setMensagem("Perfil atualizado com sucesso!");
      setEditando(false);
      setProvider(prev => ({ ...prev, ...payload }));
    } catch (error) {
      setMensagem(error.message || "Erro ao atualizar perfil.");
    }
  };

  const handleServicoChange = (e) => {
    const { name, value } = e.target;
    setNovoServico(prev => ({ ...prev, [name]: value }));
  };

  const handleCadastrarServico = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...novoServico,
        provider_id: provider.id,
      };

      const response = await fetch("http://localhost:3333/servicos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.error || "Erro ao cadastrar serviço.");
      }

      const novoServicoCadastrado = await response.json();
      setMensagem("Serviço cadastrado com sucesso!");
      setNovoServico({ titulo: "", descricao: "", preco: "" });
      setServicosPrestador(prev => [...prev, novoServicoCadastrado]);
      // setAbaAtual("perfil"); // Remova se quiser permanecer na aba
    } catch (error) {
      setMensagem(error.message || "Erro ao cadastrar serviço.");
    }
  };

  // Renderização condicional
  if (!usuario) {
    return (
      <div className={styles.dashboardPrestador}>
        Faça login para acessar o painel do prestador.
      </div>
    );
  }

  if (!provider) {
    return (
      <div className={styles.dashboardPrestador}>
        Carregando dados do prestador...
      </div>
    );
  }

  return (
    <div className={styles.dashboardPrestador}>
      <header className={styles.header}>
        <h1 className={styles.titulo}>Bem-vindo, {usuario.nome}!</h1>
        
        <nav className={styles.navegacao}>
          <button 
            onClick={() => setAbaAtual("perfil")} 
            className={`${styles.botaoNavegacao} ${abaAtual === "perfil" ? styles.ativo : ''}`}
          >
            Perfil
          </button>
          <button 
            onClick={() => setAbaAtual("cadastrar-servico")} 
            className={`${styles.botaoNavegacao} ${abaAtual === "cadastrar-servico" ? styles.ativo : ''}`}
          >
            Cadastrar Serviço
          </button>
        </nav>
      </header>

      {mensagem && (
        <div className={`${styles.mensagem} ${mensagem.includes("sucesso") ? styles.sucesso : styles.erro}`}>
          {mensagem}
        </div>
      )}

      <main className={styles.conteudoPrincipal}>
        {abaAtual === "perfil" && (
          <section className={styles.secaoPerfil}>
            <h2 className={styles.subtitulo}>Perfil do Prestador</h2>
            
            {!editando ? (
              <div className={styles.perfilDados}>
                <div className={styles.dadoItem}>
                  <span className={styles.dadoLabel}>Bio:</span>
                  <p className={styles.dadoValor}>{provider.bio || "-"}</p>
                </div>
                
                <div className={styles.dadoItem}>
                  <span className={styles.dadoLabel}>CNPJ:</span>
                  <p className={styles.dadoValor}>{provider.cnpj || "-"}</p>
                </div>
                
                <div className={styles.dadoItem}>
                  <span className={styles.dadoLabel}>Status:</span>
                  <p className={styles.dadoValor}>{provider.status || "-"}</p>
                </div>
                
                <div className={styles.dadoItem}>
                  <span className={styles.dadoLabel}>Experiência:</span>
                  <p className={styles.dadoValor}>{provider.experience || "-"}</p>
                </div>
                
                <div className={styles.dadoItem}>
                  <span className={styles.dadoLabel}>Categorias:</span>
                  <p className={styles.dadoValor}>
                    {provider.categories?.map(cat => cat.name).join(", ") || "-"}
                  </p>
                </div>
                
                <button 
                  onClick={() => setEditando(true)} 
                  className={styles.botaoPrimario}
                >
                  Editar Perfil
                </button>
              </div>
            ) : (
              <form className={styles.formulario} onSubmit={handleSalvar}>
                <div className={styles.grupoFormulario}>
                  <label htmlFor="bio" className={styles.rotulo}>Bio</label>
                  <textarea 
                    id="bio" 
                    name="bio" 
                    value={form.bio} 
                    onChange={handleChange} 
                    rows={3} 
                    className={styles.entradaTexto}
                  />
                </div>
                
                <div className={styles.grupoFormulario}>
                  <label htmlFor="cnpj" className={styles.rotulo}>CNPJ</label>
                  <input 
                    id="cnpj" 
                    name="cnpj" 
                    value={form.cnpj} 
                    onChange={handleChange} 
                    className={styles.entradaTexto}
                  />
                </div>
                
                <div className={styles.grupoFormulario}>
                  <label htmlFor="experiencia" className={styles.rotulo}>Experiência</label>
                  <input 
                    id="experiencia" 
                    name="experiencia" 
                    value={form.experiencia} 
                    onChange={handleChange} 
                    className={styles.entradaTexto}
                  />
                </div>
                
                <div className={styles.grupoFormulario}>
                  <label className={styles.rotulo}>Categorias</label>
                  <div className={styles.grupoCheckbox}>
                    {categorias.map(cat => (
                      <div key={cat.id} className={styles.opcaoCheckbox}>
                        <input
                          type="checkbox"
                          id={`cat-${cat.id}`}
                          name="categorias"
                          value={cat.id}
                          checked={form.categorias.includes(cat.id)}
                          onChange={handleChange}
                          className={styles.checkbox}
                        />
                        <label htmlFor={`cat-${cat.id}`} className={styles.rotuloCheckbox}>
                          {cat.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className={styles.acoesFormulario}>
                  <button type="submit" className={styles.botaoPrimario}>
                    Salvar
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setEditando(false)} 
                    className={styles.botaoSecundario}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </section>
        )}

        {abaAtual === "cadastrar-servico" && (
          <section className={styles.secaoServico}>
            <h2 className={styles.subtitulo}>Seus Serviços</h2>
            <div>
              {servicosPrestador.length === 0 ? (
                <p>Nenhum serviço cadastrado.</p>
              ) : (
                <table className={styles.ordensTabela}>
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Descrição</th>
                      <th>Preço (R$)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicosPrestador.map(servico => (
                      <tr key={servico.id}>
                        <td>{servico.titulo || servico.nome}</td>
                        <td>{servico.descricao}</td>
                        <td>{servico.preco}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <form className={styles.formulario} onSubmit={handleCadastrarServico}>
              <h3 className={styles.subtitulo}>Cadastrar Novo Serviço</h3>
              
              <div className={styles.grupoFormulario}>
                <label htmlFor="titulo" className={styles.rotulo}>Título do Serviço</label>
                <input 
                  id="titulo" 
                  name="titulo" 
                  value={novoServico.titulo} 
                  onChange={handleServicoChange} 
                  required 
                  className={styles.entradaTexto}
                />
              </div>
              
              <div className={styles.grupoFormulario}>
                <label htmlFor="descricao" className={styles.rotulo}>Descrição</label>
                <textarea 
                  id="descricao" 
                  name="descricao" 
                  value={novoServico.descricao} 
                  onChange={handleServicoChange} 
                  required 
                  className={styles.entradaTexto}
                />
              </div>
              
              <div className={styles.grupoFormulario}>
                <label htmlFor="preco" className={styles.rotulo}>Preço (R$)</label>
                <input 
                  id="preco" 
                  name="preco" 
                  type="number" 
                  value={novoServico.preco} 
                  onChange={handleServicoChange} 
                  required 
                  className={styles.entradaTexto}
                />
              </div>
              
              <button type="submit" className={styles.botaoPrimario}>
                Cadastrar
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
};

export default DashboardPrestador;