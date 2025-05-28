import React from 'react';
import './Passo3DadosEspecificos.css';

const Passo3DadosEspecificos = ({ tipo, dados, onChange, erros }) => {
  return (
    <div className="passo-container">
      <h2 className="text-xl font-semibold mb-6">
        {tipo === 'prestador' ? 'Informações profissionais' : 'Informações de localização'}
      </h2>
      
      {tipo === 'prestador' ? (
        // Campos para prestador de serviços
        <>
          <div className="form-grupo">
            <label htmlFor="area">Área de atuação</label>
            <input
              id="area"
              name="area"
              type="text"
              value={dados.area}
              onChange={onChange}
              placeholder="Ex: Encanador, Eletricista, Técnico em Informática"
              className={erros.area ? 'input-erro' : ''}
            />
            {erros.area && <p className="mensagem-erro">{erros.area}</p>}
          </div>
          
          <div className="form-grupo">
            <label htmlFor="experiencia">Anos de experiência</label>
            <input
              id="experiencia"
              name="experiencia"
              type="text"
              value={dados.experiencia}
              onChange={onChange}
              placeholder="Ex: 5 anos"
              className={erros.experiencia ? 'input-erro' : ''}
            />
            {erros.experiencia && <p className="mensagem-erro">{erros.experiencia}</p>}
          </div>
          
          <div className="form-grupo">
            <label htmlFor="descricao">Descrição dos serviços</label>
            <textarea
              id="descricao"
              name="descricao"
              value={dados.descricao || ''}
              onChange={onChange}
              placeholder="Descreva os serviços que você oferece..."
              rows="4"
              className={erros.descricao ? 'input-erro' : ''}
            />
            {erros.descricao && <p className="mensagem-erro">{erros.descricao}</p>}
          </div>
        </>
      ) : (
        // Campos para usuário comum
        <>
          <div className="form-grupo">
            <label htmlFor="endereco">Endereço</label>
            <input
              id="endereco"
              name="endereco"
              type="text"
              value={dados.endereco || ''}
              onChange={onChange}
              placeholder="Rua, número, complemento"
              className={erros.endereco ? 'input-erro' : ''}
            />
            {erros.endereco && <p className="mensagem-erro">{erros.endereco}</p>}
          </div>
          
          <div className="form-grupo">
            <label htmlFor="cidade">Cidade</label>
            <input
              id="cidade"
              name="cidade"
              type="text"
              value={dados.cidade || ''}
              onChange={onChange}
              placeholder="Digite sua cidade"
              className={erros.cidade ? 'input-erro' : ''}
            />
            {erros.cidade && <p className="mensagem-erro">{erros.cidade}</p>}
          </div>
          
          <div className="form-grupo">
            <label htmlFor="estado">Estado</label>
            <input
              id="estado"
              name="estado"
              type="text"
              value={dados.estado || ''}
              onChange={onChange}
              placeholder="Digite seu estado"
              className={erros.estado ? 'input-erro' : ''}
            />
            {erros.estado && <p className="mensagem-erro">{erros.estado}</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default Passo3DadosEspecificos;