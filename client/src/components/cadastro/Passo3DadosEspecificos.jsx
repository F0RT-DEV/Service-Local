import React from 'react';
import './Passo3DadosEspecificos.css';

// Lista de categorias disponíveis
const CATEGORIAS = [
  { id: 'eletricista', nome: 'Eletricista' },
  { id: 'encanador', nome: 'Encanador' },
  { id: 'informatica', nome: 'Informática' },
  { id: 'construcao', nome: 'Construção Civil' },
  { id: 'pintura', nome: 'Pintura' },
  { id: 'jardim', nome: 'Jardinagem' },
];

const Passo3DadosEspecificos = ({ tipo, dados, onChange, erros, finalizarCadastro, etapaAnterior }) => {
  const handleCategoriaChange = (e) => {
    const { value, checked } = e.target;
    let novasCategorias = [...(dados.categorias || [])];
    
    if (checked) {
      novasCategorias.push(value);
    } else {
      novasCategorias = novasCategorias.filter(cat => cat !== value);
    }
    
    onChange({
      target: {
        name: 'categorias',
        value: novasCategorias
      }
    });
  };

  return (
    <div className="passo-container">
      <h2 className="text-xl font-semibold mb-6">
        {tipo === 'prestador' ? 'Informações profissionais' : 'Informações de localização'}
      </h2>
      
      {tipo === 'prestador' ? (
        <>
          <div className="form-grupo">
            <label>Áreas de atuação</label>
            <div className="categorias-container">
              {CATEGORIAS.map(categoria => (
                <div key={categoria.id} className="categoria-option">
                  <input
                    type="checkbox"
                    id={`categoria-${categoria.id}`}
                    value={categoria.id}
                    checked={(dados.categorias || []).includes(categoria.id)}
                    onChange={handleCategoriaChange}
                  />
                  <label htmlFor={`categoria-${categoria.id}`}>
                    {categoria.nome}
                  </label>
                </div>
              ))}
            </div>
            {erros.categorias && <p className="mensagem-erro">{erros.categorias}</p>}
          </div>
          
          <div className="form-grupo">
            <label htmlFor="experiencia">Anos de experiência</label>
            <select
              id="experiencia"
              name="experiencia"
              value={dados.experiencia || ''}
              onChange={onChange}
              className={erros.experiencia ? 'input-erro' : ''}
            >
              <option value="">Selecione</option>
              <option value="menos-1">Menos de 1 ano</option>
              <option value="1-3">1-3 anos</option>
              <option value="3-5">3-5 anos</option>
              <option value="5+">Mais de 5 anos</option>
            </select>
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
        // Campos para usuário comum (opcional)
        <div className="form-grupo">
          <p>Você será direcionado para a busca de prestadores de serviço.</p>
        </div>
      )}
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
          onClick={finalizarCadastro}
          className="botao-continuar"
        >
          Finalizar Cadastro
        </button>
      </div>
      
    </div>
  );
};

export default Passo3DadosEspecificos;