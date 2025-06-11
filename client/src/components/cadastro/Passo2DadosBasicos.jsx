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
    console.log("Cliquei no botão");
    console.log("Tipo selecionado:", dados.tipo);
    if (validarPasso2()) {
      if (dados.tipo === 'usuario') {
        finalizarCadastro();
      } else {
        proximaEtapa();
      }
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
        />
        {erros.cep && <p className={styles['mensagem-erro']}>{erros.cep}</p>}
      </div>
      
      <div className={styles['form-group']}>
        <label htmlFor="estado">Estado</label>
        <input
          id="estado"
          name="estado"
          type="text"
          value={dados.estado}
          onChange={onChange}
          placeholder="Digite o estado"
          className={erros.estado ? styles['input-erro'] : ''}
        />
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
          {dados.tipo === 'usuario' ? 'Finalizar Cadastro' : 'Continuar'}
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