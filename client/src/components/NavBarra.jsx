import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserIcon, LogOut, Menu } from "lucide-react";
import styles from "./NavBarra.module.css";

const getUsuarioLocal = () => {
  try {
    const usuario = localStorage.getItem("usuario");
    return usuario ? JSON.parse(usuario) : null;
  } catch {
    return null;
  }
};

const NavBarra = () => {
  const [menuAberto, setMenuAberto] = useState(false);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [usuario, setUsuario] = useState(getUsuarioLocal());
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Atualiza usuário ao montar e quando o storage mudar
  useEffect(() => {
    const atualizarUsuario = () => setUsuario(getUsuarioLocal());
    window.addEventListener("storage", atualizarUsuario);
    return () => window.removeEventListener("storage", atualizarUsuario);
  }, []);

  // Atualiza usuário ao abrir a NavBarra (ex: após login)
  useEffect(() => {
    setUsuario(getUsuarioLocal());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    setUsuario(null);
    setMenuAberto(false);
    setDropdownAberto(false);
    window.location.href = "/"; // Força recarregamento da página
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownAberto(false);
      }
    }
    if (dropdownAberto) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownAberto]);

  return (
    <nav className={styles.navbar}>
      <div className={styles["navbar-container"]}>
        <div className={styles["navbar-content"]}>
          <div className={styles["navbar-brand"]}>
            <Link to="/" className={styles["navbar-logo"]}>
              AuxTech
            </Link>
          </div>

          {/* Botão de menu para mobile */}
          <button className={styles["menu-button"]} onClick={toggleMenu}>
            <Menu size={24} />
          </button>

          <div
            className={`${styles["navbar-right"]} ${
              menuAberto ? styles.active : ""
            }`}
          >
            {usuario ? (
              <>
                <div className={styles["nav-links"]}>
                  {/* "Buscar Serviços" aparece para client/provider */}
                  {(usuario.role === "provider" ||
                    usuario.role === "client") && (
                    <Link
                      to={
                        usuario.role === "provider"
                          ? "/prestador/dashboard?aba=buscar-servicos"
                          : "/usuario/dashboard"
                      }
                      className={styles["nav-link"]}
                    >
                      Buscar Serviços
                    </Link>
                  )}
                  {/* "Painel Admin" só para admin */}
                  {usuario.role === "admin" && (
                    <Link to="/admin/dashboard" className={styles["nav-link"]}>
                      Painel Admin
                    </Link>
                  )}
                  {/* "Prestar Serviços" só para prestador */}
                  {usuario.role === "provider" && (
                    <Link
                      to="/prestador/dashboard"
                      className={styles["nav-link"]}
                    >
                      Prestar Serviços
                    </Link>
                  )}
                </div>

                <div className={styles["user-actions"]}>
                  <div
                    className={styles["user-info"]}
                    onClick={toggleDropdown}
                    tabIndex={0}
                    ref={dropdownRef}
                  >
                    <div className={styles["user-avatar"]}>
                      <UserIcon size={18} />
                    </div>
                    <span className={styles["user-name"]}>
                      {usuario.name && usuario.name.trim() !== ""
                        ? usuario.name
                        : usuario.nome && usuario.nome.trim() !== ""
                        ? usuario.nome
                        : "Usuário"}
                    </span>

                    {dropdownAberto && (
                      <div className={styles["dropdown-menu"]}>
                        <button
  onClick={() => {
    setDropdownAberto(false);
    if (usuario.role === "provider") {
      navigate("/prestador/perfil");
    } else if (usuario.role === "admin") {
      navigate("/admin/perfil");
    } else {
      navigate("/usuario/perfil");
    }
  }}
  className={styles["profile-button"]}
>
  <span>Perfil</span>
</button>
                        <button
                          onClick={handleLogout}
                          className={styles["logout-button"]}
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
              <div className={styles["auth-buttons"]}>
                <Link to="/login" className={styles["login-button"]}>
                  Entrar
                </Link>
                <Link to="/cadastro" className={styles["register-button"]}>
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
