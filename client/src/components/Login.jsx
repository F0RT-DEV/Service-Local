import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AutenticacaoLocal";

const Login = () => {
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("usuario");
  const [erro, setErro] = useState("");
  const { login, setFeedback } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !nome.trim()) {
      setErro("Preencha todos os campos.");
      return;
    }
    const usuario = login(tipo, nome, { email });
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
    <div className="container mx-auto max-w-md p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Nome</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Digite seu nome"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Digite seu email"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Tipo de Conta</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={tipo}
            onChange={e => setTipo(e.target.value)}
          >
            <option value="usuario">Usuário</option>
            <option value="prestador">Prestador</option>
          </select>
        </div>
        {erro && <p className="mensagem-erro mb-2 text-center">{erro}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;