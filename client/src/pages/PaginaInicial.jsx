import React, { useEffect, useState } from "react";
import styles from "./PaginaInicial.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:3333";

const PaginaInicial = () => {
  // Estados para armazenar dados
  const [categorias, setCategorias] = useState([]);
  const [prestadores, setPrestadores] = useState([]);
  const [servicos, setServicos] = useState([]);
  const navigate = useNavigate();
   // Buscar categorias
  useEffect(() => {
    axios
      .get(`${API_URL}/categories`)
      .then((res) => setCategorias(res.data))
      .catch(() => setCategorias([]));
  }, []);

  // Buscar prestadores (exibir só alguns)
  useEffect(() => {
    axios
      .get(`${API_URL}/providers`)
      .then((res) => setPrestadores(res.data.slice(0, 3)))
      .catch(() => setPrestadores([]));
  }, []);

  // Buscar serviços (exibir só alguns)
  useEffect(() => {
    axios
      .get(`${API_URL}/services`)
      .then((res) => setServicos(res.data.slice(0, 6)))
      .catch(() => setServicos([]));
  }, []);
  
    // Função para checar autenticação e redirecionar
  const handleProtectedNavigation = (url) => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(url);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className={styles["techconnect-landing"]}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.containerPI}>
          <div className={styles["hero-content"]}>
            <h1>
              Conectando{" "}
              <span className={styles.highlight}>
                profissionais qualificados
              </span>{" "}
              a quem precisa de serviço
            </h1>
            <p className={styles.subtitle}>
              Soluções técnicas com segurança, agilidade e transparência
            </p>
            
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className={`${styles["stats-bar"]} ${styles.container}`}>
        <div className={styles["stat-item"]}>
          <div className={styles["stat-number"]} data-count="5200">
            5.200+
          </div>
          <div className={styles["stat-label"]}>Profissionais</div>
        </div>
        <div className={styles["stat-item"]}>
          <div className={styles["stat-number"]} data-count="18700">
            18.700+
          </div>
          <div className={styles["stat-label"]}>Serviços Realizados</div>
        </div>
        <div className={styles["stat-item"]}>
          <div className={styles["stat-number"]} data-count="4.8">
            4.8/5
          </div>
          <div className={styles["stat-label"]}>Avaliação Média</div>
        </div>
        <div className={styles["stat-item"]}>
          <div className={styles["stat-number"]} data-count="35">
            35min
          </div>
          <div className={styles["stat-label"]}>Tempo Médio</div>
        </div>
      </section>
{/* CATEGORIAS */}
      <section className={styles.container} style={{ padding: "4rem 0" }}>
        <h2 className={styles["section-title"]}>Categorias de Serviços</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center" }}>
          {categorias.length === 0 && <p>Carregando categorias...</p>}
          {categorias.map((cat) => (
            <Link
              key={cat.id}
              className={styles["btn-outline"]}
              style={{ minWidth: 180, marginBottom: 12, textAlign: "center" }}
              onClick={() => handleProtectedNavigation(`/services/category/${encodeURIComponent(cat.name)}`)}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* PRESTADORES EM DESTAQUE */}
      <section className={styles.container} style={{ padding: "4rem 0" }}>
        <h2 className={styles["section-title"]}>Profissionais em Destaque</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center" }}>
          {prestadores.length === 0 && <p>Carregando prestadores...</p>}
          {prestadores.map((p) => (
  <div
    key={p.provider_id || p.id}
    style={{
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 2px 10px #eee",
      padding: 24,
      minWidth: 220,
      textDecoration: "none",
      color: "#222",
      display: "block",
      marginBottom: 12,
    }}
  >
    <div style={{ fontWeight: 700, fontSize: 18 }}>{p.bio || "Profissional"}</div>
    <div style={{ color: "#888", fontSize: 14, margin: "8px 0" }}>
      {p.cnpj ? "PJ" : "Autônomo"}
    </div>
    <div>
      {Array.isArray(p.categories)
        ? p.categories.map((c) => c.name).join(", ")
        : ""}
    </div>
    <Link
      to={`/providers/${p.provider_id || p.id}`}
      className={styles["btn-outline"]}
      style={{ marginTop: 16, width: "100%", display: "inline-block", textAlign: "center" }}
    >
      Ver perfil
    </Link>
  </div>
))}
        </div>
      </section>

      {/* SERVIÇOS EM DESTAQUE */}
      <section className={styles.container} style={{ padding: "4rem 0" }}>
        <h2 className={styles["section-title"]}>Serviços Recentes</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center" }}>
          {servicos.length === 0 && <p>Carregando serviços...</p>}
          {servicos.map((s) => (
            <Link
              key={s.id}
              onClick={() => handleProtectedNavigation(`/services/${s.id}`)}
              style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 10px #eee",
                padding: 24,
                minWidth: 220,
                textDecoration: "none",
                color: "#222",
                display: "block",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 18 }}>{s.title}</div>
              <div style={{ color: "#888", fontSize: 14, margin: "8px 0" }}>
                {s.description?.slice(0, 60)}...
              </div>
              <div style={{ color: "#2563EB", fontWeight: 600 }}>
  {s.price_min && s.price_max
    ? `R$ ${Number(s.price_min).toFixed(2)} - R$ ${Number(s.price_max).toFixed(2)}`
    : "A combinar"}
</div>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link to="/login" className={styles["btn-accent"]}>
            Ver todos os serviços
          </Link>
        </div>
      </section>
      {/* Benefits Section */}
      <section
        id="benefits"
        className={`${styles["benefits-section"]} ${styles.container}`}
      >
        <h2 className={styles["section-title"]}>
          Por que escolher a <span className={styles.highlight}>AuxTech</span>?
        </h2>
        <p className={styles["section-subtitle"]}>
          Oferecemos a melhor experiência para clientes e profissionais
        </p>
        <div className={styles["benefits-grid"]}>
          {/* For Clients */}
          <div
            className={`${styles["benefit-card"]} ${styles["client-benefit"]}`}
          >
            <div className={styles["benefit-icon"]}>
              <i className="fas fa-user-shield"></i>
            </div>
            <h3>Para Clientes</h3>
            <ul>
              <li>
                <i className="fas fa-check-circle"></i> Profissionais
                verificados
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Preços transparentes
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Pagamento seguro
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Avaliações reais
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Garantia de satisfação
              </li>
            </ul>
          </div>
          {/* For Professionals */}
          <div className={`${styles["benefit-card"]} ${styles["pro-benefit"]}`}>
            <div className={styles["benefit-icon"]}>
              <i className="fas fa-chart-line"></i>
            </div>
            <h3>Para Profissionais</h3>
            <ul>
              <li>
                <i className="fas fa-check-circle"></i> Mais clientes
                qualificados
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Gestão simplificada
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Recebimentos garantidos
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Reputação online
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Ferramentas exclusivas
              </li>
            </ul>
          </div>
          {/* Platform Advantages */}
          <div
            className={`${styles["benefit-card"]} ${styles["platform-benefit"]}`}
          >
            <div className={styles["benefit-icon"]}>
              <i className="fas fa-cogs"></i>
            </div>
            <h3>Nossa Plataforma</h3>
            <ul>
              <li>
                <i className="fas fa-check-circle"></i> Interface intuitiva
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Sistema de avaliações
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Suporte 24/7
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Integração completa
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Atualizações constantes
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className={styles["how-it-works"]}>
        <div className={styles.container}>
          <h2 className={styles["section-title"]}>
            Como funciona em <span className={styles.highlight}>3 passos</span>{" "}
            simples
          </h2>
          <p className={styles["section-subtitle"]}>
            Encontre, contrate e avalie - tudo em um só lugar
          </p>
          <div className={styles["steps-container"]}>
            <div className={styles.step}>
              <div className={styles["step-number"]}>1</div>
              <div className={styles["step-content"]}>
                <div className={styles["step-icon"]}>
                  <i className="fas fa-search-location"></i>
                </div>
                <h3>Encontre</h3>
                <p>
                  Busque pelo serviço necessário e localize profissionais
                  próximos a você
                </p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles["step-number"]}>2</div>
              <div className={styles["step-content"]}>
                <div className={styles["step-icon"]}>
                  <i className="fas fa-handshake"></i>
                </div>
                <h3>Contrate</h3>
                <p>
                  Compare perfis, preços e avaliações antes de fechar o serviço
                </p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles["step-number"]}>3</div>
              <div className={styles["step-content"]}>
                <div className={styles["step-icon"]}>
                  <i className="fas fa-star"></i>
                </div>
                <h3>Avalie</h3>
                <p>Deixe seu feedback e ajude a melhorar nossa comunidade</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className={`${styles.testimonials} ${styles.container}`}
      >
        <h2 className={styles["section-title"]}>
          O que nossos <span className={styles.highlight}>clientes</span> dizem
        </h2>
        <p className={styles["section-subtitle"]}>
          Avaliações reais de quem já usou nossa plataforma
        </p>
        <div className={styles["testimonial-cards"]}>
          <div className={styles["testimonial-card"]}>
            <div className={styles.rating}>
              {[...Array(5)].map((_, i) => (
                <i key={i} className="fas fa-star"></i>
              ))}
            </div>
            <p className={styles["testimonial-text"]}>
              "Depois que comecei a usar a AuxTech, minha renda mensal aumentou
              em 60%. Agora consigo gerenciar todos meus serviços em um só
              lugar!"
            </p>
            <div className={styles.author}>
              <img
                src="https://labes.inf.ufes.br/wp-content/uploads/sem-foto.jpg"
                alt="Carlos Silva"
                className={styles["author-image"]}
              />
              <div className={styles["author-info"]}>
                <h4>Carlos Silva</h4>
                <p>Eletricista | São Paulo</p>
              </div>
            </div>
          </div>
          <div className={styles["testimonial-card"]}>
            <div className={styles.rating}>
              {[...Array(5)].map((_, i) => (
                <i key={i} className="fas fa-star"></i>
              ))}
            </div>
            <p className={styles["testimonial-text"]}>
              "Finalmente uma plataforma onde posso encontrar profissionais
              confiáveis para resolver problemas em casa sem medo de ser
              enganada."
            </p>
            <div className={styles.author}>
              <img
                src="https://labes.inf.ufes.br/wp-content/uploads/sem-foto.jpg"
                alt="Ana Oliveira"
                className={styles["author-image"]}
              />
              <div className={styles["author-info"]}>
                <h4>Ana Oliveira</h4>
                <p>Cliente | Rio de Janeiro</p>
              </div>
            </div>
          </div>
          <div className={styles["testimonial-card"]}>
            <div className={styles.rating}>
              {[...Array(5)].map((_, i) => (
                <i key={i} className="fas fa-star"></i>
              ))}
            </div>
            <p className={styles["testimonial-text"]}>
              "Como profissional autônomo, a AuxTech me deu visibilidade e
              clientes que eu nunca conseguiria sozinho. Recomendo para todos os
              colegas!"
            </p>
            <div className={styles.author}>
              <img
                src="https://labes.inf.ufes.br/wp-content/uploads/sem-foto.jpg"
                alt="Roberto Santos"
                className={styles["author-image"]}
              />
              <div className={styles["author-info"]}>
                <h4>Roberto Santos</h4>
                <p>Encanador | Belo Horizonte</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <h2>
            Pronto para transformar sua experiência com serviços técnicos?
          </h2>
          <p>Junte-se a milhares de clientes e profissionais satisfeitos</p>
          <div className={styles["cta-buttons"]}>
            <Link
              to="/usuario/dashboard"
              className={`${styles.btn} ${styles["btn-accent"]}`}
            >
              Encontrar Profissional
            </Link>
            <Link
              to="/cadastro"
              className={`${styles.btn} ${styles["btn-outline"]}`}
            >
              Cadastrar como Profissional
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaginaInicial;
