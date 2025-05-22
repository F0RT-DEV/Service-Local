// src/utils/AutenticacaoLocal.js

const CHAVE_LOCAL_STORAGE = 'usuario';

// Função para gerar um token mock (base64 de JSON)
const gerarToken = (usuario) => {
  return btoa(JSON.stringify({ ...usuario, timestamp: Date.now() }));
};

const AutenticacaoLocal = () => {
  const login = (tipo, nome) => {
    const usuario = { nome, tipo };
    const token = gerarToken(usuario);
    const dadosCompletos = { ...usuario, token };
    localStorage.setItem(CHAVE_LOCAL_STORAGE, JSON.stringify(dadosCompletos));
    return dadosCompletos;
  };

  const logout = () => {
    localStorage.removeItem(CHAVE_LOCAL_STORAGE);
  };

  const getUsuario = () => {
    const dados = localStorage.getItem(CHAVE_LOCAL_STORAGE);
    if (!dados) return null;
    try {
      return JSON.parse(dados);
    } catch (e) {
      console.error('Erro ao decodificar usuário do localStorage:', e);
      return null;
    }
  };

  const estaAutenticado = () => {
    return !!getUsuario();
  };

  return {
    login,
    logout,
    getUsuario,
    estaAutenticado,
  };
};

export default AutenticacaoLocal();
