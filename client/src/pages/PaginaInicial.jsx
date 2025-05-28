import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, UserCheck, Clock, Star, Wrench } from 'lucide-react';
import './PaginaInicial.css';

const PaginaInicial = () => {
  const [servicos, setServicos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Simulando busca de serviços (na prática, você buscaria de uma API)
    const buscarServicos = () => {
      try {
        const servicosSalvos = JSON.parse(localStorage.getItem('cadastros')) || [];
        const prestadores = servicosSalvos.filter(s => s.tipo === 'prestador');
        setServicos(prestadores.slice(0, 6)); // Mostrar apenas 6 serviços
        setCarregando(false);
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
        setCarregando(false);
      }
    };

    buscarServicos();
  }, []);

  return (
    <div className="pagina-inicial">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Encontre os melhores profissionais técnicos da sua região</h1>
          <p>Conectamos você com prestadores de serviços técnicos qualificados para resolver seus problemas com rapidez e segurança.</p>
          <div className="hero-buttons">
            <Link to="/cadastro" className="btn-primary">Criar uma conta</Link>
            <a href="#servicos" className="btn-secondary">Ver serviços</a>
          </div>
        </div>
      </section>
      
      {/* Serviços Section */}
      <section id="servicos" className="servicos-section">
        <div className="container">
          <h2 className="section-title">Serviços em Destaque</h2>
          
          {carregando ? (
            <div className="carregando">Carregando serviços...</div>
          ) : servicos.length > 0 ? (
            <div className="servicos-grid">
              {servicos.map((servico, index) => (
                <div key={index} className="servico-card">
                  <div className="servico-header">
                    <div className="servico-avatar">
                      <Wrench size={24} />
                    </div>
                    <h3>{servico.nome}</h3>
                    <div className="servico-avaliacao">
                      <Star size={16} fill="#fbbf24" color="#fbbf24" />
                      <span>5.0</span>
                    </div>
                  </div>
                  
                  <div className="servico-body">
                    <p><strong>Área:</strong> {servico.area}</p>
                    <p><strong>Experiência:</strong> {servico.experiencia}</p>
                    <p className="servico-descricao">{servico.descricao}</p>
                  </div>
                  
                  <div className="servico-footer">
                    <Link to={`/detalhes/${servico.email}`} className="btn-servico">
                      Ver detalhes
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="sem-servicos">
              <p>Nenhum serviço disponível no momento.</p>
            </div>
          )}
          
          <div className="ver-todos">
            <Link to="/cards" className="btn-secondary">
              Ver todos os serviços
            </Link>
          </div>
        </div>
      </section>
      
      {/* Como Funciona Section */}
      <section id="como-funciona" className="como-funciona-section">
        <div className="container">
          <h2 className="section-title">Como funciona</h2>
          
          <div className="passos-grid">
            <div className="passo-card">
              <div className="icone-wrapper">
                <UserCheck size={32} />
              </div>
              <h3>1. Cadastre-se</h3>
              <p>Crie sua conta como usuário ou prestador de serviços em apenas alguns minutos.</p>
            </div>
            
            <div className="passo-card">
              <div className="icone-wrapper">
                <Search size={32} />
              </div>
              <h3>2. Encontre ou ofereça</h3>
              <p>Busque profissionais qualificados ou ofereça seus serviços técnicos.</p>
            </div>
            
            <div className="passo-card">
              <div className="icone-wrapper">
                <Clock size={32} />
              </div>
              <h3>3. Agende</h3>
              <p>Marque o serviço para a data e horário que for mais conveniente para você.</p>
            </div>
            
            <div className="passo-card">
              <div className="icone-wrapper">
                <Shield size={32} />
              </div>
              <h3>4. Segurança</h3>
              <p>Realize pagamentos com segurança e avalie os serviços prestados.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Pronto para começar?</h2>
            <p>Crie sua conta agora mesmo e comece a encontrar os melhores profissionais ou oferecer seus serviços.</p>
            <Link to="/cadastro" className="btn-primary">Cadastrar agora</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaginaInicial;