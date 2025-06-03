import React from 'react';
import styles from './PaginaInicial.module.css';

const PaginaInicial = () => {
  return (
    <div className={styles['techconnect-landing']}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.containerPI}>
          <h1>
            Conectando <span className={styles.highlight}>profissionais qualificados</span> a quem precisa de serviço
          </h1>
          <p className={styles.subtitle}>Soluções técnicas com segurança, agilidade e transparência</p>
          <div className={styles['search-container']}>
            <div className={styles['search-box']}>
              <select>
                <option>Qual serviço você precisa?</option>
                <option>Encanador</option>
                <option>Eletricista</option>
                <option>Técnico de Informática</option>
              </select>
              <input type="text" placeholder="Digite sua localização" />
              <button className={`${styles.btn} ${styles['btn-accent']}`}>
                <i className="fas fa-search"></i> Buscar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className={`${styles['stats-bar']} ${styles.container}`}>
        <div className={styles['stat-item']}>
          <div className={styles['stat-number']}>5.200+</div>
          <div className={styles['stat-label']}>Profissionais</div>
        </div>
        <div className={styles['stat-item']}>
          <div className={styles['stat-number']}>18.700+</div>
          <div className={styles['stat-label']}>Serviços Realizados</div>
        </div>
        <div className={styles['stat-item']}>
          <div className={styles['stat-number']}>4.8/5</div>
          <div className={styles['stat-label']}>Avaliação Média</div>
        </div>
        <div className={styles['stat-item']}>
          <div className={styles['stat-number']}>35min</div>
          <div className={styles['stat-label']}>Tempo Médio</div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className={`${styles['benefits-section']} ${styles.container}`}>
        <h2 className={styles['section-title']}>Por que escolher a AuxTech?</h2>
        <div className={styles['benefits-grid']}>
          {/* For Clients */}
          <div className={`${styles['benefit-card']} ${styles['client-benefit']}`}>
            <div className={styles['benefit-icon']}>
              <i className="fas fa-user-shield"></i>
            </div>
            <h3>Para Clientes</h3>
            <ul>
              <li><i className="fas fa-check-circle"></i> Profissionais verificados</li>
              <li><i className="fas fa-check-circle"></i> Preços transparentes</li>
              <li><i className="fas fa-check-circle"></i> Pagamento seguro</li>
              <li><i className="fas fa-check-circle"></i> Avaliações reais</li>
            </ul>
          </div>
          {/* For Professionals */}
          <div className={`${styles['benefit-card']} ${styles['pro-benefit']}`}>
            <div className={styles['benefit-icon']}>
              <i className="fas fa-chart-line"></i>
            </div>
            <h3>Para Profissionais</h3>
            <ul>
              <li><i className="fas fa-check-circle"></i> Mais clientes qualificados</li>
              <li><i className="fas fa-check-circle"></i> Gestão simplificada</li>
              <li><i className="fas fa-check-circle"></i> Recebimentos garantidos</li>
              <li><i className="fas fa-check-circle"></i> Reputação online</li>
            </ul>
          </div>
          {/* Platform Advantages */}
          <div className={`${styles['benefit-card']} ${styles['platform-benefit']}`}>
            <div className={styles['benefit-icon']}>
              <i className="fas fa-cogs"></i>
            </div>
            <h3>Nossa Plataforma</h3>
            <ul>
              <li><i className="fas fa-check-circle"></i> Interface intuitiva</li>
              <li><i className="fas fa-check-circle"></i> Sistema de avaliações</li>
              <li><i className="fas fa-check-circle"></i> Suporte 24/7</li>
              <li><i className="fas fa-check-circle"></i> Integração completa</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className={styles['how-it-works']}>
        <div className={styles.container}>
          <h2 className={styles['section-title']}>Como funciona em 3 passos simples</h2>
          <div className={styles['steps-container']}>
            <div className={styles.step}>
              <div className={styles['step-number']}>1</div>
              <div className={styles['step-content']}>
                <h3>Encontre</h3>
                <p>Busque pelo serviço necessário e localize profissionais próximos a você</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles['step-number']}>2</div>
              <div className={styles['step-content']}>
                <h3>Contrate</h3>
                <p>Compare perfis, preços e avaliações antes de fechar o serviço</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles['step-number']}>3</div>
              <div className={styles['step-content']}>
                <h3>Avalie</h3>
                <p>Deixe seu feedback e ajude a melhorar nossa comunidade</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className={`${styles.testimonials} ${styles.container}`}>
        <h2 className={styles['section-title']}>O que estão dizendo</h2>
        <div className={styles['testimonial-cards']}>
          <div className={styles['testimonial-card']}>
            <div className={styles.rating}>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
            </div>
            <p className={styles['testimonial-text']}>"Depois que comecei a usar a AuxTech, minha renda mensal aumentou em 60%. Agora consigo gerenciar todos meus serviços em um só lugar!"</p>
            <div className={styles.author}>
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Carlos Silva" />
              <div>
                <h4>Carlos Silva</h4>
                <p>Eletricista | São Paulo</p>
              </div>
            </div>
          </div>
          <div className={styles['testimonial-card']}>
            <div className={styles.rating}>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
            </div>
            <p className={styles['testimonial-text']}>"Finalmente uma plataforma onde posso encontrar profissionais confiáveis para resolver problemas em casa sem medo de ser enganada."</p>
            <div className={styles.author}>
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Ana Oliveira" />
              <div>
                <h4>Ana Oliveira</h4>
                <p>Cliente | Rio de Janeiro</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaginaInicial;