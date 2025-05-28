import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CardsCadastros.css';

const CardsCadastros = () => {
  const [cadastros, setCadastros] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [cadastroSelecionado, setCadastroSelecionado] = useState(null);
  const { email } = useParams();
  const navigate = useNavigate();
  const cardsPorPagina = 12;

  useEffect(() => {
    const cadastrosSalvos = JSON.parse(localStorage.getItem('cadastros')) || [];
    setCadastros(cadastrosSalvos);

    if (email) {
      const encontrado = cadastrosSalvos.find(c => c.email === email);
      if (encontrado) {
        setCadastroSelecionado(encontrado);
      } else {
        navigate('/cards'); // Redireciona se o cadastro não for encontrado
      }
    }
  }, [email, navigate]);

  const indexUltimoCard = paginaAtual * cardsPorPagina;
  const indexPrimeiroCard = indexUltimoCard - cardsPorPagina;
  const cardsAtuais = cadastros.slice(indexPrimeiroCard, indexUltimoCard);
  const totalPaginas = Math.ceil(cadastros.length / cardsPorPagina);

  const mudarPagina = (numeroPagina) => {
    setPaginaAtual(numeroPagina);
    window.scrollTo(0, 0);
  };

  const verDetalhes = (cadastro) => {
    setCadastroSelecionado(cadastro);
    navigate(`/detalhes/${cadastro.email}`);
  };

  const voltarParaCards = () => {
    setCadastroSelecionado(null);
    navigate('/cards');
  };

  if (cadastroSelecionado) {
    return (
      <div className="detalhes-container">
        <button onClick={voltarParaCards} className="btn-voltar">
          &larr; Voltar para a lista
        </button>

        <div className="detalhes-card">
          <h2>{cadastroSelecionado.nome}</h2>
          <p><strong>Tipo:</strong> {cadastroSelecionado.tipo === 'prestador' ? 'Prestador de Serviço' : 'Usuário Comum'}</p>
          <p><strong>Email:</strong> {cadastroSelecionado.email}</p>
          <p><strong>Telefone:</strong> {cadastroSelecionado.telefone}</p>

          {cadastroSelecionado.tipo === 'prestador' ? (
            <>
              <h3>Informações Profissionais</h3>
              <p><strong>Área de Atuação:</strong> {cadastroSelecionado.area}</p>
              <p><strong>Experiência:</strong> {cadastroSelecionado.experiencia}</p>
              <p><strong>Descrição:</strong> {cadastroSelecionado.descricao}</p>
            </>
          ) : (
            <>
              <h3>Informações de Endereço</h3>
              <p><strong>Endereço:</strong> {cadastroSelecionado.endereco}</p>
              <p><strong>Cidade:</strong> {cadastroSelecionado.cidade}</p>
              <p><strong>Estado:</strong> {cadastroSelecionado.estado}</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="cards-container">
      <h1>Veja os serviços cadastrados no nosso site! 😊</h1>

      {cadastros.length === 0 ? (
        <p className="sem-cadastros">Nenhum cadastro encontrado.</p>
      ) : (
        <>
          <div className="cards-grid">
            {cardsAtuais.map((cadastro, index) => (
              <div key={index} className="card" onClick={() => verDetalhes(cadastro)}>
                <div className="card-header">
                  <h3>{cadastro.nome}</h3>
                  <span className={`tipo-badge ${cadastro.tipo}`}>
                    {cadastro.tipo === 'prestador' ? 'Prestador' : 'Usuário'}
                  </span>
                </div>
                <div className="card-body">
                  <p><strong>Email:</strong> {cadastro.email}</p>
                  <p><strong>Telefone:</strong> {cadastro.telefone}</p>
                  {cadastro.tipo === 'prestador' && (
                    <p><strong>Área:</strong> {cadastro.area}</p>
                  )}
                </div>
                <div className="card-footer">
                  <button className="btn-detalhes">Ver detalhes</button>
                </div>
              </div>
            ))}
          </div>

          {totalPaginas > 1 && (
            <div className="paginacao">
              <button 
                onClick={() => mudarPagina(paginaAtual - 1)} 
                disabled={paginaAtual === 1}
              >
                Anterior
              </button>

              {Array.from({ length: totalPaginas }, (_, i) => (
                <button
                  key={i}
                  onClick={() => mudarPagina(i + 1)}
                  className={paginaAtual === i + 1 ? 'ativo' : ''}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => mudarPagina(paginaAtual + 1)} 
                disabled={paginaAtual === totalPaginas}
              >
                Próximo
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CardsCadastros;
