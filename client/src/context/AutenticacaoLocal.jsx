import React, { createContext, useContext, useState, useEffect } from 'react';

const CHAVE_LOCAL_STORAGE = 'usuario';

// Função para salvar dados de forma ofuscada
const salvarUsuarioLocalStorage = (dados) => {
  const dadosString = JSON.stringify(dados);
  const dadosOfuscados = btoa(dadosString);
  localStorage.setItem(CHAVE_LOCAL_STORAGE, dadosOfuscados);
};

// Função para recuperar dados de forma ofuscada
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

/**
 * Gera um token simulado (mock) em formato base64, contendo os dados do usuário e um timestamp.
 * @param {Object} usuario - Objeto com dados do usuário.
 * @returns {string} Token base64.
 */
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
  const [feedback, setFeedback] = useState(""); // Novo estado para feedback visual

  // Carrega o usuário do localStorage ao iniciar
  useEffect(() => {
    const usuarioArmazenado = recuperarUsuarioLocalStorage();
    if (usuarioArmazenado) {
      setUsuario(usuarioArmazenado);
    }
    setCarregando(false);
  }, []);

  // Função para realizar login
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

  // Função para realizar logout
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
      {/* Exibe feedback visual se houver */}
      {feedback && (
        <div style={{
          background: "#fde047",
          color: "#92400e",
          padding: "10px",
          margin: "10px 0",
          borderRadius: "5px",
          textAlign: "center"
        }}>
          {feedback}
        </div>
      )}
      {children}
    </AutenticacaoContext.Provider>
  );
};

export default AutenticacaoContext;