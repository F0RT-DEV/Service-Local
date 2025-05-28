import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, UserCheck, Clock } from 'lucide-react';
import './PaginaInicial.css';

const PaginaInicial = () => {
  return (
    <div className="pagina-inicial">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Encontre os melhores profissionais técnicos da sua região</h1>
          <p>Conectamos você com prestadores de serviços técnicos qualificados para resolver seus problemas com rapidez e segurança.</p>
          <div className="hero-buttons">
            <Link to="/cadastro" className="btn-primary">Criar uma conta</Link>
            <a href="#como-funciona" className="btn-secondary">Saiba mais</a>
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