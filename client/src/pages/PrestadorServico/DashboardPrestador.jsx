import React, { useState, useEffect } from "react";
import styles from "./DashboardPrestador.module.css";

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
  const [abaAtual, setAbaAtual] = useState("perfil");
  const [provider, setProvider] = useState(undefined);
  const [categorias, setCategorias] = useState([]);
  const [editando, setEditando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erroCarregamento, setErroCarregamento] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [form, setForm] = useState({
    bio: "",
    cnpj: "",
    experiencia: "",
    categorias: [],
  });

  const [novoServico, setNovoServico] = useState({
    title: "",
    description: "",
    category_id: "",
    price_min: "",
    price_max: "",
    images: "",
    is_active: true,
  });

  const [servicosPrestador, setServicosPrestador] = useState([]);
  const [ordens, setOrdens] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);

  // Buscar categorias
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch("http://localhost:3333/categories");
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        setCategorias([]);
      }
    };
    fetchCategorias();
  }, []);

  // Buscar provider do usuário
  useEffect(() => {
    if (!usuario?.id) {
      setProvider(null);
      return;
    }
    let cancelado = false;
    const fetchProviderData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3333/providers?user_id=${usuario.id}`
        );
        if (!response.ok) {
          const erro = await response.text();
          setErroCarregamento(`Erro HTTP: ${response.status} - ${erro}`);
          if (!cancelado) setProvider(null);
          return;
        }
        const data = await response.json();
        const prov = Array.isArray(data) ? data[0] : data;
        if (!cancelado) {
          if (prov) {
            setProvider(prov);
            setForm({
              bio: prov?.bio || "",
              cnpj: prov?.cnpj || "",
              experiencia: prov?.experience || "",
              categorias: prov?.categories
                ? prov.categories.map((c) => c.id)
                : [],
            });
          } else {
            setProvider(null);
          }
        }
      } catch (error) {
        setErroCarregamento(
          error.message || "Erro desconhecido ao buscar provider."
        );
        if (!cancelado) setProvider(null);
      }
    };

    fetchProviderData();
    return () => {
      cancelado = true;
    };
  }, [usuario?.id]);


  // Buscar serviços do próprio prestador usando /services/me
useEffect(() => {
  if (abaAtual === "cadastrar-servico" || abaAtual === "buscar-servicos") {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3333/services/me", {
      headers: {
        "Authorization": token ? `Bearer ${token}` : undefined,
      }
    })
      .then(res => res.json())
      .then(data => setServicosPrestador(Array.isArray(data) ? data : []))
      .catch(() => setServicosPrestador([]));
  }
}, [abaAtual]);

  // Buscar serviços do próprio prestador para ambas as abas
  useEffect(() => {
    if (
      (abaAtual === "cadastrar-servico" || abaAtual === "buscar-servicos") &&
      provider?.id
    ) {
      const token = localStorage.getItem("token");
      fetch(`http://localhost:3333/providers/${provider.id}/services`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      })
        .then((res) => res.json())
        .then(setServicosPrestador)
        .catch(() => setServicosPrestador([]));
    }
  }, [abaAtual, provider?.id]);

  // Buscar ordens de serviço do prestador
  useEffect(() => {
    if (abaAtual === "os" || abaAtual === "historico") {
      if (!usuario?.id) return;
      fetch(`http://localhost:3333/orders?provider_id=${usuario.id}`)
        .then((res) => res.json())
        .then(setOrdens)
        .catch(() => setOrdens([]));
    }
  }, [abaAtual, usuario?.id]);

  // Buscar avaliações recebidas
  useEffect(() => {
    if (abaAtual === "historico") {
      if (!usuario?.id) return;
      fetch(`http://localhost:3333/reviews?provider_id=${usuario.id}`)
        .then((res) => res.json())
        .then(setAvaliacoes)
        .catch(() => setAvaliacoes([]));
    }
  }, [abaAtual, usuario?.id]);

  // Handlers
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "categorias") {
      const novasCategorias = checked
        ? [...form.categorias, value]
        : form.categorias.filter((cat) => cat !== value);
      setForm((prev) => ({ ...prev, categorias: novasCategorias }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleServicoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNovoServico((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Salvar perfil do prestador
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

      const response = await fetch(
        `http://localhost:3333/providers/${usuario.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.error || "Erro ao atualizar perfil.");
      }

      setMensagem("Perfil atualizado com sucesso!");
      setEditando(false);
      setProvider((prev) => ({ ...prev, ...payload }));
      window.location.reload(); // Força recarregamento após salvar perfil
    } catch (error) {
      setMensagem(error.message || "Erro ao atualizar perfil.");
    }
  };

  // Cadastro de serviço
  const handleCadastrarServico = async (e) => {
    e.preventDefault();

    if (
      !novoServico.title ||
      !novoServico.description ||
      !novoServico.category_id ||
      novoServico.price_min === "" ||
      novoServico.price_max === ""
    ) {
      setMensagem("Preencha todos os campos obrigatórios.");
      return;
    }

    if (novoServico.description.length < 10) {
      setMensagem("A descrição deve ter pelo menos 10 caracteres.");
      return;
    }

    const priceMin = parseFloat(novoServico.price_min);
    const priceMax = parseFloat(novoServico.price_max);
    const isActive = !!novoServico.is_active;

    if (isNaN(priceMin) || isNaN(priceMax)) {
      setMensagem("Preços devem ser números válidos.");
      return;
    }

    try {
      const payload = {
        category_id: novoServico.category_id,
        title: novoServico.title,
        description: novoServico.description,
        price_min: priceMin,
        price_max: priceMax,
        images: novoServico.images,
        is_active: isActive,
      };

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3333/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const erro = await response.json();
        alert(
          "Erro ao cadastrar serviço:\n" +
            (erro.details
              ? JSON.stringify(erro.details, null, 2)
              : erro.error || "Erro desconhecido")
        );
        setMensagem(
          (erro.details && JSON.stringify(erro.details)) ||
            erro.error ||
            "Erro ao cadastrar serviço."
        );
        throw new Error(erro.error || "Erro ao cadastrar serviço.");
      }

      const novoServicoCadastrado = await response.json();
      setMensagem("Serviço cadastrado com sucesso!");
      setNovoServico({
        title: "",
        description: "",
        category_id: "",
        price_min: "",
        price_max: "",
        images: "",
        is_active: true,
      });
      setServicosPrestador((prev) => [...prev, novoServicoCadastrado]);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 2500);
      // window.location.reload(); // Removido para mostrar o popup
    } catch (error) {
      setMensagem(error.message || "Erro ao cadastrar serviço.");
    }
  };

  // --- LÓGICA DE RENDERIZAÇÃO ---

  // Função utilitária para renderizar imagens
  const renderImagens = (images) => {
    if (Array.isArray(images)) {
      return (
        <div className={styles.tdImagens}>
          {images.map((img, idx) =>
            img && img.trim() ? (
              <img key={idx} src={img.trim()} alt="Serviço" />
            ) : null
          )}
        </div>
      );
    }
    if (typeof images === "string" && images.trim() !== "") {
      return (
        <div className={styles.tdImagens}>
          {images
            .split(",")
            .map((img, idx) =>
              img.trim() ? (
                <img key={idx} src={img.trim()} alt="Serviço" />
              ) : null
            )}
        </div>
      );
    }
    return <span>-</span>;
  };

  if (!usuario) {
    return (
      <div className={styles.dashboardPrestador}>
        Faça login para acessar o painel do prestador.
      </div>
    );
  }

  if (provider === undefined) {
    return (
      <div className={styles.dashboardPrestador}>
        Carregando dados do prestador. Aguarde...
        {erroCarregamento && (
          <div style={{ color: "red", marginTop: 16 }}>
            Erro ao carregar provider: {erroCarregamento}
          </div>
        )}
      </div>
    );
  }

  if (provider === null) {
    return (
      <div className={styles.dashboardPrestador}>
        <div style={{ color: "red", marginTop: 16 }}>
          Você ainda não possui perfil de prestador.
          <br />
          Solicite ao administrador a criação do seu perfil de prestador.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardPrestador}>
      {/* Popup de sucesso */}
      {showSuccessPopup && (
        <div
          style={{
            position: "fixed",
            top: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#22c55e",
            color: "#fff",
            padding: "18px 32px",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "1.1rem",
            zIndex: 9999,
            boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
          }}
        >
          O serviço foi cadastrado com sucesso!
        </div>
      )}

      <header className={styles.header}>
        <h1 className={styles.titulo}>Bem-vindo, {usuario.nome}!</h1>
        <nav className={styles.navegacao}>
          <button
            onClick={() => setAbaAtual("perfil")}
            className={`${styles.botaoNavegacao} ${
              abaAtual === "perfil" ? styles.ativo : ""
            }`}
          >
            Perfil
          </button>
          <button
            onClick={() => setAbaAtual("cadastrar-servico")}
            className={`${styles.botaoNavegacao} ${
              abaAtual === "cadastrar-servico" ? styles.ativo : ""
            }`}
          >
            Cadastrar Serviço
          </button>
          <button
            onClick={() => setAbaAtual("buscar-servicos")}
            className={`${styles.botaoNavegacao} ${
              abaAtual === "buscar-servicos" ? styles.ativo : ""
            }`}
          >
            Meus Serviços
          </button>
          <button
            onClick={() => setAbaAtual("os")}
            className={`${styles.botaoNavegacao} ${
              abaAtual === "os" ? styles.ativo : ""
            }`}
          >
            Ordens de Serviço
          </button>
          <button
            onClick={() => setAbaAtual("historico")}
            className={`${styles.botaoNavegacao} ${
              abaAtual === "historico" ? styles.ativo : ""
            }`}
          >
            Histórico & Avaliações
          </button>
        </nav>
      </header>

      {mensagem && (
        <div
          className={`${styles.mensagem} ${
            mensagem.includes("sucesso") ? styles.sucesso : styles.erro
          }`}
        >
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
                  <p className={styles.dadoValor}>
                    {provider.experience || "-"}
                  </p>
                </div>
                <div className={styles.dadoItem}>
                  <span className={styles.dadoLabel}>Categorias:</span>
                  <p className={styles.dadoValor}>
                    {provider.categories?.map((cat) => cat.name).join(", ") ||
                      "-"}
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
                  <label htmlFor="bio" className={styles.rotulo}>
                    Bio
                  </label>
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
                  <label htmlFor="cnpj" className={styles.rotulo}>
                    CNPJ
                  </label>
                  <input
                    id="cnpj"
                    name="cnpj"
                    value={form.cnpj}
                    onChange={handleChange}
                    className={styles.entradaTexto}
                  />
                </div>
                <div className={styles.grupoFormulario}>
                  <label htmlFor="experiencia" className={styles.rotulo}>
                    Experiência
                  </label>
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
                    {categorias.map((cat) => (
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
                        <label
                          htmlFor={`cat-${cat.id}`}
                          className={styles.rotuloCheckbox}
                        >
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
                      <th>Categoria</th>
                      <th>Preço Mínimo</th>
                      <th>Preço Máximo</th>
                      <th>Imagens</th>
                      <th>Ativo?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicosPrestador.map((servico) => (
                      <tr key={servico.id}>
                        <td>{servico.title}</td>
                        <td>{servico.description}</td>
                        <td>
                          {categorias.find((c) => c.id === servico.category_id)
                            ?.name || servico.category_id}
                        </td>
                        <td>{servico.price_min}</td>
                        <td>{servico.price_max}</td>
                        <td>{renderImagens(servico.images)}</td>
                        <td>{servico.is_active ? "Sim" : "Não"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <form
              className={styles.formulario}
              onSubmit={handleCadastrarServico}
            >
              <h3 className={styles.subtitulo}>Cadastrar Novo Serviço</h3>
              <div className={styles.grupoFormulario}>
                <label htmlFor="title" className={styles.rotulo}>
                  Título do Serviço
                </label>
                <input
                  id="title"
                  name="title"
                  value={novoServico.title}
                  onChange={handleServicoChange}
                  required
                  className={styles.entradaTexto}
                />
              </div>
              <div className={styles.grupoFormulario}>
                <label htmlFor="description" className={styles.rotulo}>
                  Descrição
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={novoServico.description}
                  onChange={handleServicoChange}
                  required
                  className={styles.entradaTexto}
                />
              </div>
              <div className={styles.grupoFormulario}>
                <label htmlFor="category_id" className={styles.rotulo}>
                  Categoria
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={novoServico.category_id}
                  onChange={handleServicoChange}
                  required
                  className={styles.entradaTexto}
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.grupoFormulario}>
                <label htmlFor="price_min" className={styles.rotulo}>
                  Preço Mínimo (R$)
                </label>
                <input
                  id="price_min"
                  name="price_min"
                  type="number"
                  min="0"
                  value={novoServico.price_min}
                  onChange={handleServicoChange}
                  required
                  className={styles.entradaTexto}
                />
              </div>
              <div className={styles.grupoFormulario}>
                <label htmlFor="price_max" className={styles.rotulo}>
                  Preço Máximo (R$)
                </label>
                <input
                  id="price_max"
                  name="price_max"
                  type="number"
                  min="0"
                  value={novoServico.price_max}
                  onChange={handleServicoChange}
                  required
                  className={styles.entradaTexto}
                />
              </div>
              <div className={styles.grupoFormulario}>
                <label htmlFor="images" className={styles.rotulo}>
                  Imagens (URL ou texto, separadas por vírgula)
                </label>
                <input
                  id="images"
                  name="images"
                  value={novoServico.images}
                  onChange={handleServicoChange}
                  className={styles.entradaTexto}
                  placeholder="URL da imagem ou deixe em branco"
                />
              </div>
              <div className={styles.grupoFormulario}>
                <label htmlFor="is_active" className={styles.rotulo}>
                  Ativo?
                </label>
                <input
                  id="is_active"
                  name="is_active"
                  type="checkbox"
                  checked={novoServico.is_active}
                  onChange={handleServicoChange}
                  className={styles.checkbox}
                />
              </div>
              <button type="submit" className={styles.botaoPrimario}>
                Cadastrar
              </button>
            </form>
          </section>
        )}

        {abaAtual === "buscar-servicos" && (
          <section className={styles.secaoServico}>
            <h2 className={styles.subtitulo}>Meus Serviços</h2>
            {servicosPrestador.length === 0 ? (
              <p>Nenhum serviço cadastrado.</p>
            ) : (
              <table className={styles.ordensTabela}>
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Descrição</th>
                    <th>Categoria</th>
                    <th>Preço Mínimo</th>
                    <th>Preço Máximo</th>
                    <th>Imagens</th>
                    <th>Ativo?</th>
                  </tr>
                </thead>
                <tbody>
                  {servicosPrestador.map((servico) => (
                    <tr key={servico.id}>
                      <td>{servico.title}</td>
                      <td>{servico.description}</td>
                      <td>
                        {categorias.find((c) => c.id === servico.category_id)
                          ?.name || servico.category_id}
                      </td>
                      <td>{servico.price_min}</td>
                      <td>{servico.price_max}</td>
                      <td>{renderImagens(servico.images)}</td>
                      <td>{servico.is_active ? "Sim" : "Não"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        {abaAtual === "os" && (
          <section>
            <h2 className={styles.subtitulo}>Ordens de Serviço em andamento</h2>
            <div className={styles["ordens-lista"]}>
              {ordens.filter((o) => o.status !== "finalizada").length === 0 ? (
                <p>Nenhuma OS em andamento.</p>
              ) : (
                ordens
                  .filter((o) => o.status !== "finalizada")
                  .map((ordem) => (
                    <div key={ordem.id} className={styles["ordem-card"]}>
                      <p>
                        <strong>Serviço:</strong> {ordem.servicoTitulo}
                      </p>
                      <p>
                        <strong>Status:</strong> {ordem.status}
                      </p>
                      <p>
                        <strong>Cliente:</strong> {ordem.clienteNome}
                      </p>
                    </div>
                  ))
              )}
            </div>
          </section>
        )}

        {abaAtual === "historico" && (
          <section>
            <h2 className={styles.subtitulo}>
              Histórico de Atendimentos & Avaliações Recebidas
            </h2>
            <div className={styles["ordens-lista"]}>
              {ordens.filter((o) => o.status === "finalizada").length === 0 ? (
                <p>Nenhuma OS finalizada ainda.</p>
              ) : (
                ordens
                  .filter((o) => o.status === "finalizada")
                  .map((ordem) => (
                    <div key={ordem.id} className={styles["ordem-card"]}>
                      <p>
                        <strong>Serviço:</strong> {ordem.servicoTitulo}
                      </p>
                      <p>
                        <strong>Cliente:</strong> {ordem.clienteNome}
                      </p>
                      <p>
                        <strong>Data:</strong>{" "}
                        {new Date(ordem.dataSolicitacao).toLocaleDateString()}
                      </p>
                      {avaliacoes.filter((av) => av.order_id === ordem.id)
                        .length > 0 ? (
                        avaliacoes
                          .filter((av) => av.order_id === ordem.id)
                          .map((av) => (
                            <div key={av.id} className={styles["avaliacao"]}>
                              <strong>Avaliação:</strong> {av.rating} ⭐<br />
                              <strong>Comentário:</strong> {av.comment}
                            </div>
                          ))
                      ) : (
                        <span>Sem avaliação</span>
                      )}
                    </div>
                  ))
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default DashboardPrestador;
