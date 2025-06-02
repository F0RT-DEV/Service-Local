import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserIcon, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AutenticacaoLocal';
import './NavBarra.css'; // Certifique-se de ter o CSS adequado para estilização

const NavBarra = () => {
  const { estaAutenticado, getUsuario, logout } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const navigate = useNavigate();
  const usuario = getUsuario();
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuAberto(false);
    setDropdownAberto(false);
  };

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  const toggleDropdown = () => {
    setDropdownAberto(!dropdownAberto);
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

          {/* Botão de menu para mobile */}
          <button className="menu-button" onClick={toggleMenu}>
            <Menu size={24} />
          </button>

          <div className={`navbar-right ${menuAberto ? 'active' : ''}`}>
            {estaAutenticado() ? (
              <>
                <div className="nav-links">
                  <Link to="/cards" className="nav-link">
                    Buscar Serviços
                  </Link>
                  {usuario?.tipo === 'prestador' && (
                    <Link to="/prestar-servicos" className="nav-link">
                      Prestar Serviços
                    </Link>
                  )}
                </div>

                <div className="user-actions">
                  <div 
                    className="user-info" 
                    onClick={toggleDropdown}
                    onMouseEnter={() => setDropdownAberto(true)}
                    onMouseLeave={() => setDropdownAberto(false)}
                  >
                    <div className="user-avatar">
                      <UserIcon size={18} />
                    </div>
                    <span className="user-name">
                      {usuario?.nome || 'Usuário'}
                    </span>
                    
                    {dropdownAberto && (
                      <div className="dropdown-menu">
                        <button 
                          onClick={handleLogout}
                          className="logout-button"
                        >
                          <LogOut size={16} />
                          <span>Sair</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="auth-buttons">
                {/* <Link to="/login" className="login-button">
                  Entrar
                </Link> */}
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

export default NavBarra;