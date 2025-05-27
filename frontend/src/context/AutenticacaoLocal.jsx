
const CHAVE_LOCAL_STORAGE = 'usuario';

/**
 * Gera um token simulado (mock) em formato base64, contendo os dados do usuário e um timestamp.
 * @param {Object} usuario - Objeto com dados do usuário.
 * @returns {string} Token base64.
 */
const gerarToken = (usuario) => {
  return btoa(JSON.stringify({ ...usuario, timestamp: Date.now() }));
};

/**
 * Serviço de autenticação local.
 * Permite login, logout, leitura e verificação de autenticação usando localStorage.
 */
const AutenticacaoLocal = () => {
  /**
   * Realiza o login do usuário e salva no localStorage.
   * @param {string} tipo - Tipo de usuário: 'admin', 'cliente' ou 'prestador'.
   * @param {string} nome - Nome do usuário.
   * @returns {Object} Dados do usuário autenticado com token.
   */
  const login = (tipo, nome) => {
    const usuario = { nome, tipo };
    const token = gerarToken(usuario);
    const dadosCompletos = { ...usuario, token };
    localStorage.setItem(CHAVE_LOCAL_STORAGE, JSON.stringify(dadosCompletos));
    return dadosCompletos;
  };

  /**
   * Remove os dados do usuário do localStorage (logout).
   */
  const logout = () => {
    localStorage.removeItem(CHAVE_LOCAL_STORAGE);
  };

  /**
   * Retorna o usuário atual salvo no localStorage, se existir.
   * @returns {Object|null} Dados do usuário ou null se não houver.
   */
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

  /**
   * Verifica se há um usuário autenticado.
   * @returns {boolean} true se autenticado, false caso contrário.
   */
  const estaAutenticado = () => {
    return !!getUsuario();
  };

  // Exporta os métodos como um "serviço" único
  return {
    login,
    logout,
    getUsuario,
    estaAutenticado,
  };
};

// Exporta a instância imediatamente
export default AutenticacaoLocal();
