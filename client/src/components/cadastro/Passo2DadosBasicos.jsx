import './Passo2DadosBasicos.css';
import PropTypes from 'prop-types';

const Passo2DadosBasicos = ({ 
  dados, 
  onChange, 
  erros, 
  validarPasso2 = () => true,
  proximaEtapa = () => {},
  etapaAnterior = () => {},
  finalizarCadastro = () => {} // Adicionamos esta prop
}) => {
  const handleContinuar = () => {
    if (validarPasso2()) {
      // Se for usuário comum, finaliza o cadastro direto
      if (dados.tipo === 'usuario') {
        finalizarCadastro();
      } else {
        // Se for prestador, vai para a próxima etapa
        proximaEtapa();
      }
    }
  };

  return (
    <div className="passo-container2">
      <h2 className="text-xl font-semibold mb-6">Informações básicas</h2>
      
      <div className="form-group">
        <label htmlFor="nome">Nome completo</label>
        <input
          id="nome"
          name="nome"
          type="text"
          value={dados.nome || ''}
          onChange={onChange}
          placeholder="Digite seu nome completo"
          className={erros.nome ? 'input-erro' : ''}
        />
        {erros.nome && <p className="mensagem-erro">{erros.nome}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={dados.email}
          onChange={onChange}
          placeholder="Digite seu email"
          className={erros.email ? 'input-erro' : ''}
        />
        {erros.email && <p className="mensagem-erro">{erros.email}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="telefone">Telefone</label>
        <input
          id="telefone"
          name="telefone"
          type="tel"
          value={dados.telefone}
          onChange={onChange}
          placeholder="(XX) XXXXX-XXXX"
          className={erros.telefone ? 'input-erro' : ''}
        />
        {erros.telefone && <p className="mensagem-erro">{erros.telefone}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="cpf">CPF</label>
        <input
          id="cpf"
          name="cpf"
          type="text"
          value={dados.cpf}
          onChange={onChange}
          placeholder="Digite seu CPF"
          className={erros.cpf ? 'input-erro' : ''}
        />
        {erros.cpf && <p className="mensagem-erro">{erros.cpf}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="cnpj">CNPJ</label>
        <input
          id="cnpj"
          name="cnpj"
          type="text"
          value={dados.cnpj}
          onChange={onChange}
          placeholder="Digite seu CNPJ"
          className={erros.cnpj ? 'input-erro' : ''}
        />
        {erros.cnpj && <p className="mensagem-erro">{erros.cnpj}</p>}
      </div>
      
      <h3 className="text-lg font-semibold mt-6 mb-4">Endereço</h3>
      
      <div className="form-group">
        <label htmlFor="rua">Rua</label>
        <input
          id="rua"
          name="rua"
          type="text"
          value={dados.rua}
          onChange={onChange}
          placeholder="Digite o nome da rua"
          className={erros.rua ? 'input-erro' : ''}
        />
        {erros.rua && <p className="mensagem-erro">{erros.rua}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="numero">Número</label>
        <input
          id="numero"
          name="numero"
          type="text"
          value={dados.numero}
          onChange={onChange}
          placeholder="Digite o número"
          className={erros.numero ? 'input-erro' : ''}
        />
        {erros.numero && <p className="mensagem-erro">{erros.numero}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="complemento">Complemento</label>
        <input
          id="complemento"
          name="complemento"
          type="text"
          value={dados.complemento}
          onChange={onChange}
          placeholder="Digite o complemento"
          className={erros.complemento ? 'input-erro' : ''}
        />
        {erros.complemento && <p className="mensagem-erro">{erros.complemento}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="cep">CEP</label>
        <input
          id="cep"
          name="cep"
          type="text"
          value={dados.cep}
          onChange={onChange}
          placeholder="Digite o CEP"
          className={erros.cep ? 'input-erro' : ''}
        />
        {erros.cep && <p className="mensagem-erro">{erros.cep}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="estado">Estado</label>
        <input
          id="estado"
          name="estado"
          type="text"
          value={dados.estado}
          onChange={onChange}
          placeholder="Digite o estado"
          className={erros.estado ? 'input-erro' : ''}
        />
        {erros.estado && <p className="mensagem-erro">{erros.estado}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="cidade">Cidade</label>
        <input
          id="cidade"
          name="cidade"
          type="text"
          value={dados.cidade}
          onChange={onChange}
          placeholder="Digite a cidade"
          className={erros.cidade ? 'input-erro' : ''}
        />
        {erros.cidade && <p className="mensagem-erro">{erros.cidade}</p>}
      </div>
      
      <div className="botoes-navegacao">
        <button 
          type="button" 
          onClick={etapaAnterior}
          className="botao-voltar"
        >
          Voltar
        </button>
        <button 
          type="button" 
          onClick={handleContinuar}
          className="botao-continuar"
        >
          {dados.tipo === 'usuario' ? 'Finalizar Cadastro' : 'Continuar'}
        </button>
      </div>
    </div>
  );
};

// Validação das props
Passo2DadosBasicos.propTypes = {
  dados: PropTypes.shape({
    nome: PropTypes.string,
    email: PropTypes.string,
    telefone: PropTypes.string,
    cpf: PropTypes.string,
    cnpj: PropTypes.string,
    rua: PropTypes.string,
    numero: PropTypes.string,
    complemento: PropTypes.string,
    cep: PropTypes.string,
    estado: PropTypes.string,
    cidade: PropTypes.string
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  erros: PropTypes.object.isRequired,
  validarPasso2: PropTypes.func,
  proximaEtapa: PropTypes.func
};

export default Passo2DadosBasicos;