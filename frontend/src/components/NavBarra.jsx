import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../context/AutenticacaoLocal';
import './NavBarra.css';

const NavBar = () => {
  const { estaAutenticado, getUsuario, logout } = useAuth();
  const navigate = useNavigate();
  const usuario = getUsuario();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-brand">
            <Link to="/" className="navbar-logo">
              TechServices
            </Link>
          </div>
          
          <div className="navbar-right">
            {estaAutenticado() ? (
              <div className="user-info">
                <div className="user-avatar">
                  <UserIcon size={18} />
                </div>
                <span className="user-name">{usuario.nome}</span>
                
                <button 
                  onClick={handleLogout}
                  className="logout-button"
                >
                  <LogOut size={18} />
                  <span>Sair</span>
                </button>
              </div>
            ) : (
              <div>
                <Link to="/cadastro" className="register-button">
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;