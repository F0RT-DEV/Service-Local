import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AutenticacaoLocal";
import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const { setFeedback, login } = useAuth(); 
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!email.trim() || !senha.trim()) {
    setErro("Preencha todos os campos.");
    return;
  }
  // Não passa mais o tipo, só email e senha
  const usuario = await login(null, email, senha);
  if (usuario) {
    setFeedback("Login realizado com sucesso!");
    // Redireciona conforme o tipo retornado do backend
    if (usuario.tipo === "usuario") {
      navigate("/usuario/dashboard");
    } else if (usuario.tipo === "prestador") {
      navigate("/prestador/dashboard");
    } else {
      // Caso queira tratar outros tipos
      navigate("/");
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