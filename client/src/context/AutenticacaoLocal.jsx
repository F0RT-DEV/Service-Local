import React, { createContext, useContext, useState, useEffect } from 'react';

const CHAVE_LOCAL_STORAGE = 'usuario';

const salvarUsuarioLocalStorage = (dados) => {
  const dadosString = JSON.stringify(dados);
  const dadosOfuscados = btoa(dadosString);
  localStorage.setItem(CHAVE_LOCAL_STORAGE, dadosOfuscados);
};

const recuperarUsuarioLocalStorage = () => {
  const dadosOfuscados = localStorage.getItem(CHAVE_LOCAL_STORAGE);
  if (!dadosOfuscados) return null;
  try {
    const dadosString = atob(dadosOfuscados);
    return JSON.parse(dadosString);
  } catch (e) {
    console.error('Erro ao decodificar usuário do localStorage:', e);
    localStorage.removeItem(CHAVE_LOCAL_STORAGE);
    return null;
  }
};

const gerarToken = (usuario) => {
  return btoa(JSON.stringify({ ...usuario, timestamp: Date.now() }));
};

const AutenticacaoContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AutenticacaoContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AutenticacaoProvider');
  }
  return context;
};

export const AutenticacaoProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const usuarioArmazenado = recuperarUsuarioLocalStorage();
    if (usuarioArmazenado) {
      setUsuario(usuarioArmazenado);
    }
    setCarregando(false);
  }, []);

  // ⚠️ Novo useEffect para limpar feedback após 5s
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedback("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const login = (tipo, nome, dadosAdicionais = {}) => {
    if (!tipo || !nome) {
      setFeedback("Tipo e nome são obrigatórios para login.");
      return null;
    }
    const dadosUsuario = { nome, tipo, ...dadosAdicionais };
    const token = gerarToken(dadosUsuario);
    const dadosCompletos = { ...dadosUsuario, token };

    salvarUsuarioLocalStorage(dadosCompletos);
    setUsuario(dadosCompletos);
    setFeedback(""); // Limpa feedback ao logar
    return dadosCompletos;
  };

  const logout = () => {
    localStorage.removeItem(CHAVE_LOCAL_STORAGE);
    setUsuario(null);
    setFeedback("Logout realizado com sucesso.");
  };

  const estaAutenticado = () => !!usuario;
  const getUsuario = () => usuario;

  const valor = {
    usuario,
    carregando,
    login,
    logout,
    estaAutenticado,
    getUsuario,
    feedback,
    setFeedback
  };

  return (
    <AutenticacaoContext.Provider value={valor}>
      {feedback && (
        <div style={{
          background: "#fde047",
          color: "#92400e",
          padding: "10px",
          margin: "10px 0",
          borderRadius: "5px",
          textAlign: "center",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}>
          {feedback}
        </div>
      )}
      {children}
    </AutenticacaoContext.Provider>
  );
};

export default AutenticacaoContext;
