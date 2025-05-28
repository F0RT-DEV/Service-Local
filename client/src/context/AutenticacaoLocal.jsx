import React, { createContext, useContext, useState, useEffect } from 'react';

// Constante para armazenar a chave no localStorage
const CHAVE_LOCAL_STORAGE = 'usuario';

/**
 * Gera um token simulado (mock) em formato base64, contendo os dados do usuário e um timestamp.
 * @param {Object} usuario - Objeto com dados do usuário.
 * @returns {string} Token base64.
 */
const gerarToken = (usuario) => {
  return btoa(JSON.stringify({ ...usuario, timestamp: Date.now() }));
};

// Criação do contexto
const AutenticacaoContext = createContext(null);

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AutenticacaoContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AutenticacaoProvider');
  }
  return context;
};

// Provedor do contexto de autenticação
export const AutenticacaoProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Carrega o usuário do localStorage ao iniciar
  useEffect(() => {
    const recuperarUsuario = () => {
      const dadosArmazenados = localStorage.getItem(CHAVE_LOCAL_STORAGE);
      if (dadosArmazenados) {
        try {
          const usuarioArmazenado = JSON.parse(dadosArmazenados);
          setUsuario(usuarioArmazenado);
        } catch (e) {
          console.error('Erro ao decodificar usuário do localStorage:', e);
          localStorage.removeItem(CHAVE_LOCAL_STORAGE);
        }
      }
      setCarregando(false);
    };

    recuperarUsuario();
  }, []);

  // Função para realizar login
  const login = (tipo, nome, dadosAdicionais = {}) => {
    const dadosUsuario = { nome, tipo, ...dadosAdicionais };
    const token = gerarToken(dadosUsuario);
    const dadosCompletos = { ...dadosUsuario, token };
    
    localStorage.setItem(CHAVE_LOCAL_STORAGE, JSON.stringify(dadosCompletos));
    setUsuario(dadosCompletos);
    
    return dadosCompletos;
  };

  // Função para realizar logout
  const logout = () => {
    localStorage.removeItem(CHAVE_LOCAL_STORAGE);
    setUsuario(null);
  };

  // Verifica se o usuário está autenticado
  const estaAutenticado = () => !!usuario;

  // Obtém o usuário atual
  const getUsuario = () => usuario;

  // Valor do contexto
  const valor = {
    usuario,
    carregando,
    login,
    logout,
    estaAutenticado,
    getUsuario
  };

  return (
    <AutenticacaoContext.Provider value={valor}>
      {children}
    </AutenticacaoContext.Provider>
  );
};

export default AutenticacaoContext;