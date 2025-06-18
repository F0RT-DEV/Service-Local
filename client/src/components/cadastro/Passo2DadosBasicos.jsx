import styles from './Passo2DadosBasicos.module.css';
import PropTypes from 'prop-types';

const Passo2DadosBasicos = ({ 
  dados, 
  onChange, 
  erros, 
  validarPasso2 = () => true,
  proximaEtapa = () => {},
  etapaAnterior = () => {},
  finalizarCadastro = () => {}
}) => {
  const handleContinuar = () => {
    if (validarPasso2()) {
      finalizarCadastro();
    }
  };

  return (
    <div className={styles['passo-container2']}>
      <h2 className={`${styles['text-xl']} ${styles['font-semibold']} ${styles['mb-6']}`}>Informações básicas</h2>
      
      <div className={styles['form-group']}>
        <label htmlFor="nome">Nome completo</label>
        <input
          id="nome"
          name="nome"
          type="text"
          value={dados.nome}
          onChange={onChange}
          placeholder="Digite seu nome completo"
          className={erros.nome ? styles['input-erro'] : ''}
          maxLength={100}
        />
        {erros.nome && <p className={styles['mensagem-erro']}>{erros.nome}</p>}
      </div>
      
      <div className={styles['form-group']}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={dados.email}
          onChange={onChange}
          placeholder="Digite seu email"
          className={erros.email ? styles['input-erro'] : ''}
          maxLength={100}
        />
        {erros.email && <p className={styles['mensagem-erro']}>{erros.email}</p>}
      </div>

      <div className={styles['form-group']}>
        <label htmlFor="senha">Senha</label>
        <input
          id="senha"
          name="senha"
          type="password"
          value={dados.senha}
          onChange={onChange}
          placeholder="Digite sua senha"
          className={erros.senha ? styles['input-erro'] : ''}
          maxLength={50}
        />
        {erros.senha && <p className={styles['mensagem-erro']}>{erros.senha}</p>}
      </div>
      
      <div className={styles['form-group']}>
        <label htmlFor="telefone">Telefone</label>
        <input
          id="telefone"
          name="telefone"
          type="tel"
          value={dados.telefone}
          onChange={onChange}
          placeholder="(XX) XXXXX-XXXX"
          className={erros.telefone ? styles['input-erro'] : ''}
          maxLength={11}
        />
        {erros.telefone && <p className={styles['mensagem-erro']}>{erros.telefone}</p>}
      </div>
      
      <div className={styles['form-group']}>
        <label htmlFor="cpf">CPF</label>
        <input
          id="cpf"
          name="cpf"
          type="text"
          value={dados.cpf}
          onChange={onChange}
          placeholder="Digite seu CPF"
          className={erros.cpf ? styles['input-erro'] : ''}
          maxLength={11}
        />
        {erros.cpf && <p className={styles['mensagem-erro']}>{erros.cpf}</p>}
      </div>
      
      <h3 className={`${styles['text-lg']} ${styles['font-semibold']} ${styles['mt-6']} ${styles['mb-4']}`}>Endereço</h3>
      
      <div className={styles['form-group']}>
        <label htmlFor="rua">Rua</label>
        <input
          id="rua"
          name="rua"
          type="text"
          value={dados.rua}
          onChange={onChange}
          placeholder="Digite o nome da rua"
          className={erros.rua ? styles['input-erro'] : ''}
          maxLength={100}
        />
        {erros.rua && <p className={styles['mensagem-erro']}>{erros.rua}</p>}
      </div>
      
      <div className={styles['form-group']}>
        <label htmlFor="numero">Número</label>
        <input
          id="numero"
          name="numero"
          type="text"
          value={dados.numero}
          onChange={onChange}
          placeholder="Digite o número"
          className={erros.numero ? styles['input-erro'] : ''}
          maxLength={10}
        />
        {erros.numero && <p className={styles['mensagem-erro']}>{erros.numero}</p>}
      </div>
      
      <div className={styles['form-group']}>
        <label htmlFor="complemento">Complemento</label>
        <input
          id="complemento"
          name="complemento"
          type="text"
          value={dados.complemento}
          onChange={onChange}
          placeholder="Digite o complemento"
          className={erros.complemento ? styles['input-erro'] : ''}
          maxLength={50}
        />
        {erros.complemento && <p className={styles['mensagem-erro']}>{erros.complemento}</p>}
      </div>
      
      <div className={styles['form-group']}>
        <label htmlFor="bairro">Bairro</label>
        <input
          id="bairro"
          name="bairro"
          type="text"
          value={dados.bairro}
          onChange={onChange}
          placeholder="Digite o bairro"
          className={erros.bairro ? styles['input-erro'] : ''}
          maxLength={50}
        />
        {erros.bairro && <p className={styles['mensagem-erro']}>{erros.bairro}</p>}
      </div>
      
      <div className={styles['form-group']}>
        <label htmlFor="cep">CEP</label>
        <input
          id="cep"
          name="cep"
          type="text"
          value={dados.cep}
          onChange={onChange}
          placeholder="Digite o CEP"
          className={erros.cep ? styles['input-erro'] : ''}
          maxLength={9}
        />
        {erros.cep && <p className={styles['mensagem-erro']}>{erros.cep}</p>}
      </div>
      
      <div className={styles['form-group']}>
        <label htmlFor="estado">Estado</label>
        <select
          id="estado"
          name="estado"
          value={dados.estado}
          onChange={onChange}
          className={erros.estado ? styles['input-erro'] : ''}
        >
          <option value="">Selecione o estado</option>
          <option value="AC">AC</option>
          <option value="AL">AL</option>
          <option value="AP">AP</option>
          <option value="AM">AM</option>
          <option value="BA">BA</option>
          <option value="CE">CE</option>
          <option value="DF">DF</option>
          <option value="ES">ES</option>
          <option value="GO">GO</option>
          <option value="MA">MA</option>
          <option value="MT">MT</option>
          <option value="MS">MS</option>
          <option value="MG">MG</option>
          <option value="PA">PA</option>
          <option value="PB">PB</option>
          <option value="PR">PR</option>
          <option value="PE">PE</option>
          <option value="PI">PI</option>
          <option value="RJ">RJ</option>
          <option value="RN">RN</option>
          <option value="RS">RS</option>
          <option value="RO">RO</option>
          <option value="RR">RR</option>
          <option value="SC">SC</option>
          <option value="SP">SP</option>
          <option value="SE">SE</option>
          <option value="TO">TO</option>
        </select>
        {erros.estado && <p className={styles['mensagem-erro']}>{erros.estado}</p>}
      </div>
      
      <div className={styles['form-group']}>
        <label htmlFor="cidade">Cidade</label>
        <input
          id="cidade"
          name="cidade"
          type="text"
          value={dados.cidade}
          onChange={onChange}
          placeholder="Digite a cidade"
          className={erros.cidade ? styles['input-erro'] : ''}
          maxLength={50}
        />
        {erros.cidade && <p className={styles['mensagem-erro']}>{erros.cidade}</p>}
      </div>
      
      <div className={styles['botoes-navegacao']}>
        <button 
          type="button" 
          onClick={etapaAnterior}
          className={styles['botao-voltar']}
        >
          Voltar
        </button>
        <button 
          type="button" 
          onClick={handleContinuar}
          className={styles['botao-continuar']}
        >
          Finalizar Cadastro
        </button>
      </div>
    </div>
  );
};

Passo2DadosBasicos.propTypes = {
  dados: PropTypes.shape({
    nome: PropTypes.string,
    email: PropTypes.string,
    senha: PropTypes.string,
    telefone: PropTypes.string,
    cpf: PropTypes.string,
    rua: PropTypes.string,
    numero: PropTypes.string,
    complemento: PropTypes.string,
    bairro: PropTypes.string,
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
