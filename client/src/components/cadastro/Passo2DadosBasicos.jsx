import React from 'react';
import './Passo2DadosBasicos.css';

const Passo2DadosBasicos = ({ dados, onChange, erros }) => {
  return (
    <div className="passo-container">
      <h2 className="text-xl font-semibold mb-6">Informações básicas</h2>
      
      <div className="form-grupo">
        <label htmlFor="nome">Nome completo</label>
        <input
          id="nome"
          name="nome"
          type="text"
          value={dados.nome}
          onChange={onChange}
          placeholder="Digite seu nome completo"
          className={erros.nome ? 'input-erro' : ''}
        />
        {erros.nome && <p className="mensagem-erro">{erros.nome}</p>}
      </div>
      
      <div className="form-grupo">
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
      
      <div className="form-grupo">
        <label htmlFor="senha">Senha</label>
        <input
          id="senha"
          name="senha"
          type="password"
          value={dados.senha}
          onChange={onChange}
          placeholder="Crie uma senha segura"
          className={erros.senha ? 'input-erro' : ''}
        />
        {erros.senha && <p className="mensagem-erro">{erros.senha}</p>}
      </div>
      
      <div className="form-grupo">
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
    </div>
  );
};

export default Passo2DadosBasicos;