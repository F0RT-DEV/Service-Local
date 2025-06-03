import React, { useEffect, useState } from 'react';
import styles from './Passo3DadosEspecificos.module.css';

const Passo3DadosEspecificos = ({ tipo, dados, onChange, erros, finalizarCadastro, etapaAnterior }) => {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/servicosCategorias')
      .then(res => res.json())
      .then(data => {
        const areasUnicas = Array.from(new Set(data.map(servico => servico.area)));
        setCategorias(areasUnicas);
      });
  }, []);

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
    <div className={styles['passo-container']}>
      <h2 className={`${styles['text-xl']} ${styles['font-semibold']} ${styles['mb-6']}`}>
        {tipo === 'prestador' ? 'Informações profissionais' : 'Informações de localização'}
      </h2>
      
      {tipo === 'prestador' ? (
        <>
          <div className={styles['form-grupo']}>
            <label>Áreas de atuação</label>
            <div className={styles['categorias-container']}>
              {categorias.map(area => (
                <div key={area} className={styles['categoria-option']}>
                  <input
                    type="checkbox"
                    id={`categoria-${area}`}
                    value={area}
                    checked={(dados.categorias || []).includes(area)}
                    onChange={handleCategoriaChange}
                  />
                  <label htmlFor={`categoria-${area}`}>
                    {area}
                  </label>
                </div>
              ))}
            </div>
            {erros.categorias && <p className={styles['mensagem-erro']}>{erros.categorias}</p>}
          </div>
          
          <div className={styles['form-grupo']}>
            <label htmlFor="experiencia">Anos de experiência</label>
            <select
              id="experiencia"
              name="experiencia"
              value={dados.experiencia || ''}
              onChange={onChange}
              className={erros.experiencia ? styles['input-erro'] : ''}
            >
              <option value="">Selecione</option>
              <option value="menos-1">Menos de 1 ano</option>
              <option value="1-3">1-3 anos</option>
              <option value="3-5">3-5 anos</option>
              <option value="5+">Mais de 5 anos</option>
            </select>
            {erros.experiencia && <p className={styles['mensagem-erro']}>{erros.experiencia}</p>}
          </div>
          
          <div className={styles['form-grupo']}>
            <label htmlFor="descricao">Descrição dos serviços</label>
            <textarea
              id="descricao"
              name="descricao"
              value={dados.descricao || ''}
              onChange={onChange}
              placeholder="Descreva os serviços que você oferece..."
              rows="4"
              className={erros.descricao ? styles['input-erro'] : ''}
            />
            {erros.descricao && <p className={styles['mensagem-erro']}>{erros.descricao}</p>}
          </div>
        </>
      ) : (
        <div className={styles['form-grupo']}>
          <p>Você será direcionado para a busca de prestadores de serviço.</p>
        </div>
      )}
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
          onClick={finalizarCadastro}
          className={styles['botao-continuar']}
        >
          Finalizar Cadastro
        </button>
      </div>
    </div>
  );
};

export default Passo3DadosEspecificos;