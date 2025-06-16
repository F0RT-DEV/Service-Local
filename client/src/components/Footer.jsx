import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles['footer-container']}>
        <div className={styles['footer-content']}>
          <div className={styles['footer-brand']}>
            <p className={styles['footer-title']}>AuxTech</p>
            <p className={styles['footer-subtitle']}>Conectando profissionais técnicos e clientes</p>
          </div>
          
          <div className={styles['footer-links']}>
            <Link to="/sobre" className={styles['footer-link']}>
              Sobre
            </Link>
            <Link to="/termos" className={styles['footer-link']}>
              Termos
            </Link>
            <Link to="/privacidade" className={styles['footer-link']}>
              Privacidade
            </Link>
            <Link to="/contato" className={styles['footer-link']}>
              Contato
            </Link>
          </div>
        </div>
        
        <div className={styles['footer-bottom']}>
          &copy; {new Date().getFullYear()} AuxTech. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;