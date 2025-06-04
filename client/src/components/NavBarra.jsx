import { useState, useRef, useEffect } from 'react';
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
  const dropdownRef = useRef(null);

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
    setDropdownAberto((prev) => !prev);
  };

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownAberto(false);
      }
    }
    if (dropdownAberto) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownAberto]);

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
  {usuario?.tipo === 'usuario' && (
    <Link to="/usuario/dashboard" className={styles['nav-link']}>
      Buscar Serviços
    </Link>
  )}
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
                    tabIndex={0}
                    ref={dropdownRef}
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
                          onClick={() => {
                            setDropdownAberto(false);
                            navigate('/usuario/perfil');
                          }}
                          className={styles['profile-button']}
                        >
                          <span>Perfil</span>
                        </button>
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