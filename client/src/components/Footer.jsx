import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <p className="footer-title">TechServices</p>
            <p className="footer-subtitle">Conectando profissionais técnicos e clientes</p>
          </div>
          
          <div className="footer-links">
            <Link to="/sobre" className="footer-link">
              Sobre
            </Link>
            <Link to="/termos" className="footer-link">
              Termos
            </Link>
            <Link to="/privacidade" className="footer-link">
              Privacidade
            </Link>
            <Link to="/contato" className="footer-link">
              Contato
            </Link>
          </div>
        </div>
        
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} TechServices. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;