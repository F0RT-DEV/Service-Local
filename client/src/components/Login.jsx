import React, { useState } from "react";
import axios from "axios";
import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    if (!email.trim() || !senha.trim()) {
      setErro("Preencha todos os campos.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:3333/login", {
        email,
        password: senha,
      });
      const { token, user } = res.data;
      // Salva token e usuário no localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(user));

      // LOGS PARA DEPURAÇÃO
      console.log("TOKEN SALVO:", token);
      console.log("USER SALVO:", user);

      // Redireciona com base no role do usuário
      if (user.role === "client") {
        window.location.href = "/usuario/dashboard";
      } else if (user.role === "provider") {
        window.location.href = "/prestador/dashboard";
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      setErro(
        error.response?.data?.error ||
        "Erro ao conectar ao servidor. Tente novamente."
      );
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