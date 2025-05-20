import './App.css'
function App() {

  return (
    <>
      <div className="techconnect-landing">
      {/* Navbar */}
      <nav className="navbarContainer">
        <div className="logo">
          <img src="./ServicoDigital.jpg" alt="" />
        </div>
        <div className="nav-links">
          <a href="#benefits">Vantagens</a>
          <a href="#how-it-works">Como Funciona</a>
          <a href="#testimonials">Depoimentos</a>
          <a href="#contact">Contato</a>
        </div>
        <div className="cta-buttons">
          <a href="#" className="btn btn-outline">Sou Profissional</a>
          <a href="#" className="btn btn-primary">Buscar Serviço</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Conectando <span className="highlight">profissionais qualificados</span> a quem precisa de serviço</h1>
          <p className="subtitle">Soluções técnicas com segurança, agilidade e transparência</p>
          
          <div className="search-container">
            <div className="search-box">
              <select>
                <option>Qual serviço você precisa?</option>
                <option>Encanador</option>
                <option>Eletricista</option>
                <option>Técnico de Informática</option>
              </select>
              <input type="text" placeholder="Digite sua localização" />
              <button className="btn btn-accent">
                <i className="fas fa-search"></i> Buscar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-bar container">
        <div className="stat-item">
          <div className="stat-number">5.200+</div>
          <div className="stat-label">Profissionais</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">18.700+</div>
          <div className="stat-label">Serviços Realizados</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">4.8/5</div>
          <div className="stat-label">Avaliação Média</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">35min</div>
          <div className="stat-label">Tempo Médio</div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="benefits-section container">
        <h2 className="section-title">Por que escolher a AuxTech?</h2>
        
        <div className="benefits-grid">
          {/* For Clients */}
          <div className="benefit-card client-benefit">
            <div className="benefit-icon">
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
          <div className="benefit-card pro-benefit">
            <div className="benefit-icon">
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
          <div className="benefit-card platform-benefit">
            <div className="benefit-icon">
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
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <h2 className="section-title">Como funciona em 3 passos simples</h2>
          
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Encontre</h3>
                <p>Busque pelo serviço necessário e localize profissionais próximos a você</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Contrate</h3>
                <p>Compare perfis, preços e avaliações antes de fechar o serviço</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Avalie</h3>
                <p>Deixe seu feedback e ajude a melhorar nossa comunidade</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="testimonials container">
        <h2 className="section-title">O que estão dizendo</h2>
        
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <div className="rating">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
            </div>
            <p className="testimonial-text">"Depois que comecei a usar a AuxTech, minha renda mensal aumentou em 60%. Agora consigo gerenciar todos meus serviços em um só lugar!"</p>
            <div className="author">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Carlos Silva" />
              <div>
                <h4>Carlos Silva</h4>
                <p>Eletricista | São Paulo</p>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="rating">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
            </div>
            <p className="testimonial-text">"Finalmente uma plataforma onde posso encontrar profissionais confiáveis para resolver problemas em casa sem medo de ser enganada."</p>
            <div className="author">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Ana Oliveira" />
              <div>
                <h4>Ana Oliveira</h4>
                <p>Cliente | Rio de Janeiro</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Pronto para transformar sua experiência com serviços técnicos?</h2>
            <p>Junte-se a milhares de profissionais e clientes satisfeitos</p>
            
            <div className="cta-buttons">
              <a href="#" className="btn btn-light">Quero contratar</a>
              <a href="#" className="btn btn-outline-light">Sou profissional</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">
                <span>AuxTech</span>
              </div>
              <p>Conectando talentos locais a quem precisa de serviço com qualidade e segurança</p>
            </div>
            
            <div className="footer-links">
              <div className="link-group">
                <h4>Para Clientes</h4>
                <a href="#">Como funciona</a>
                <a href="#">Segurança</a>
                <a href="#">Preços</a>
              </div>
              
              <div className="link-group">
                <h4>Para Profissionais</h4>
                <a href="#">Cadastro</a>
                <a href="#">Taxas</a>
                <a href="#">Dúvidas</a>
              </div>
              
              <div className="link-group">
                <h4>Empresa</h4>
                <a href="#">Sobre nós</a>
                <a href="#">Carreiras</a>
                <a href="#">Contato</a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
            </div>
            <div className="copyright">
              © 2023 AuxTech. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  )
}

export default App
