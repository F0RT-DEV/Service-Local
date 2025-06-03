import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AutenticacaoLocal";
import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("usuario");
  const [erro, setErro] = useState("");
  const { setFeedback, login } = useAuth(); 
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!email.trim() || !senha.trim()) {
    setErro("Preencha todos os campos.");
    return;
  }
  const usuario = await login(tipo, email, senha);
  if (usuario) {
    setFeedback("Login realizado com sucesso!");
    if (tipo === "usuario") {
      navigate("/usuario/dashboard");
    } else {
      navigate("/prestador/dashboard");
    }
  } else {
    setErro("Dados inválidos.");
  }
};

  return (
    <div className={styles['container']}>
      <h2 className={styles['titulo']}>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles['form-group']}>
          <label className={styles['label']}>Email</label>
          <input
            type="email"
            className={styles['input']}
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Digite seu email"
          />
        </div>
        <div className={styles['form-group']}>
          <label className={styles['label']}>Senha</label>
          <input
            type="password"
            className={styles['input']}
            value={senha}
            onChange={e => setSenha(e.target.value)}
            placeholder="Digite sua senha"
          />
        </div>
        <div className={styles['form-group']}>
          <label className={styles['label']}>Tipo de Conta</label>
          <select
            className={styles['input']}
            value={tipo}
            onChange={e => setTipo(e.target.value)}
          >
            <option value="usuario">Usuário</option>
            <option value="prestador">Prestador</option>
          </select>
        </div>
        {erro && <p className={styles['mensagem-erro']}>{erro}</p>}
        <button
          type="submit"
          className={styles['btn-login']}
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;