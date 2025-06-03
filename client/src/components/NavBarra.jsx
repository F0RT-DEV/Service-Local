import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserIcon, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AutenticacaoLocal';
import styles from './NavBarra.module.css';

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
    <nav className={styles.navbar}>
      <div className={styles['navbar-container']}>
        <div className={styles['navbar-content']}>
          <div className={styles['navbar-brand']}>
            <Link to="/" className={styles['navbar-logo']}>
              TechServices
            </Link>
          </div>

          {/* Botão de menu para mobile */}
          <button className={styles['menu-button']} onClick={toggleMenu}>
            <Menu size={24} />
          </button>

          <div className={`${styles['navbar-right']} ${menuAberto ? styles.active : ''}`}>
            {estaAutenticado() ? (
              <>
                <div className={styles['nav-links']}>
                  <Link to="/usuario/dashboard" className={styles['nav-link']}>
                    Buscar Serviços
                  </Link>
                  {usuario?.tipo === 'prestador' && (
                    <Link to="/prestador/dashboard" className={styles['nav-link']}>
                      Prestar Serviços
                    </Link>
                  )}
                </div>

                <div className={styles['user-actions']}>
                  <div
                    className={styles['user-info']}
                    onClick={toggleDropdown}
                    onMouseEnter={() => setDropdownAberto(true)}
                    onMouseLeave={() => setDropdownAberto(false)}
                  >
                    <div className={styles['user-avatar']}>
                      <UserIcon size={18} />
                    </div>
                    <span className={styles['user-name']}>
                      {usuario?.nome && usuario.nome.trim() !== "" ? usuario.nome : 'Usuário'}
                    </span>

                    {dropdownAberto && (
                      <div className={styles['dropdown-menu']}>
                        <button
                          onClick={handleLogout}
                          className={styles['logout-button']}
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
              <div className={styles['auth-buttons']}>
                <Link to="/login" className={styles['login-button']}>
                  Entrar
                </Link>
                <Link to="/cadastro" className={styles['register-button']}>
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