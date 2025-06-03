import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AutenticacaoLocal';
import styles from './DashboardPrestador.module.css';

const DashboardPrestador = () => {
  const { usuario } = useAuth();
  const [meusServicos, setMeusServicos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [servicoEditando, setServicoEditando] = useState(null);
  const [novoServico, setNovoServico] = useState({
    imagem: '',
    nome: '',
    area: '',
    descricao: '',
    experiencia: '',
    regiao: '',
    valor: ''
  });

  // Carrega serviços do prestador
  const carregarServicos = () => {
    fetch('http://localhost:5000/servicos')
      .then(res => res.json())
      .then(data => {
        const meus = data.filter(s => String(s.prestadorId) === String(usuario.id));
        setMeusServicos(meus);
      });
  };

  useEffect(() => {
    carregarServicos();
    // eslint-disable-next-line
  }, [usuario.id]);

  const handleChange = (e) => {
    setNovoServico({ ...novoServico, [e.target.name]: e.target.value });
  };

  const abrirModal = () => {
    setNovoServico({
      imagem: '',
      nome: '',
      area: '',
      descricao: '',
      experiencia: '',
      regiao: '',
      valor: ''
    });
    setServicoEditando(null);
    setShowModal(true);
  };

  const fecharModal = () => {
    setShowModal(false);
    setServicoEditando(null);
  };

  // Salva novo ou edita serviço
  const handleCadastrarServico = (e) => {
    e.preventDefault();
    const servicoParaSalvar = {
      ...novoServico,
      prestadorId: usuario.id
    };

    if (servicoEditando) {
      // Edição: PUT
      fetch(`http://localhost:5000/servicos/${servicoEditando.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...servicoParaSalvar, id: servicoEditando.id })
      })
        .then(res => res.json())
        .then(() => {
          carregarServicos();
          fecharModal();
        });
    } else {
      // Novo: POST
      fetch('http://localhost:5000/servicos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(servicoParaSalvar)
      })
        .then(res => res.json())
        .then(() => {
          carregarServicos();
          fecharModal();
        });
    }
  };

  // Excluir serviço
  const handleExcluir = (id) => {
    fetch(`http://localhost:5000/servicos/${id}`, {
      method: 'DELETE'
    }).then(() => {
      setMeusServicos(meusServicos.filter(s => String(s.id) !== String(id)));
    });
  };

  // Editar serviço
  const handleEditar = (servico) => {
    setNovoServico({
      imagem: servico.imagem || '',
      nome: servico.nome || '',
      area: servico.area || '',
      descricao: servico.descricao || '',
      experiencia: servico.experiencia || '',
      regiao: servico.regiao || '',
      valor: servico.valor || ''
    });
    setServicoEditando(servico);
    setShowModal(true);
  };

  return (
    <div className={styles['dashboard-prestador']}>
      <h1>Meus serviços cadastrados</h1>
      <button className={styles['btn-cadastrar']} onClick={abrirModal}>
        Cadastrar Serviço
      </button>

      <div className={styles['servicos-lista']}>
        {meusServicos.length === 0 ? (
          <p>Você ainda não cadastrou nenhum serviço.</p>
        ) : (
          meusServicos.map((servico) => (
            <div key={servico.id} className={styles['servico-card']}>
              <img
                src={servico.imagem || 'https://via.placeholder.com/120x80?text=Serviço'}
                alt={servico.nome}
                className={styles['servico-imagem']}
              />
              <div className={styles['servico-info']}>
                <h3>{servico.nome}</h3>
                <p><strong>Área:</strong> {servico.area}</p>
                <p><strong>Descrição:</strong> {servico.descricao}</p>
                <p><strong>Experiência:</strong> {servico.experiencia}</p>
                <p><strong>Região:</strong> {servico.regiao}</p>
                <p><strong>Valor:</strong> {servico.valor}</p>
              </div>
              <div className={styles['servico-actions']}>
                <button onClick={() => handleEditar(servico)} className={styles['btn-editar']}>Editar</button>
                <button onClick={() => handleExcluir(servico.id)} className={styles['btn-excluir']}>Excluir</button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal']}>
            <h2>{servicoEditando ? "Editar Serviço" : "Cadastrar Serviço"}</h2>
            <form onSubmit={handleCadastrarServico} className={styles['form-cadastro-servico']}>
              {/* ...inputs e labels como já estão... */}
              <div className={styles['form-group']}>
                <label htmlFor="imagem">Link da imagem</label>
                <input
                  id="imagem"
                  type="text"
                  name="imagem"
                  placeholder="Link da imagem"
                  value={novoServico.imagem}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles['form-group']}>
                <label htmlFor="nome">Nome do serviço</label>
                <input
                  id="nome"
                  type="text"
                  name="nome"
                  placeholder="Nome do serviço"
                  value={novoServico.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles['form-group']}>
                <label htmlFor="area">Área</label>
                <input
                  id="area"
                  type="text"
                  name="area"
                  placeholder="Área"
                  value={novoServico.area}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles['form-group']}>
                <label htmlFor="regiao">Região</label>
                <input
                  id="regiao"
                  type="text"
                  name="regiao"
                  placeholder="Região"
                  value={novoServico.regiao}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles['form-group']}>
                <label htmlFor="valor">Valor (R$)</label>
                <input
                  id="valor"
                  type="text"
                  name="valor"
                  placeholder="Valor (R$)"
                  value={novoServico.valor}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles['form-group']}>
                <label htmlFor="experiencia">Experiência</label>
                <input
                  id="experiencia"
                  type="text"
                  name="experiencia"
                  placeholder="Experiência"
                  value={novoServico.experiencia}
                  onChange={handleChange}
                />
              </div>
              <div className={styles['form-group']}>
                <label htmlFor="descricao">Descrição</label>
                <textarea
                  id="descricao"
                  name="descricao"
                  placeholder="Descrição"
                  value={novoServico.descricao}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles['modal-actions']}>
                <button type="submit" className={styles['btn-cadastrar']}>
                  {servicoEditando ? "Salvar Alterações" : "Cadastrar"}
                </button>
                <button type="button" onClick={fecharModal} className={styles['btn-cancelar']}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPrestador;