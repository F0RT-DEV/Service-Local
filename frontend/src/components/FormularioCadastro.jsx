// src/components/FormularioCadastro.jsx
import React, { useState } from 'react';

const FormularioCadastro = ({ tipo, onSubmit }) => {
  const [dados, setDados] = useState({
    nome: '',
    email: '',
    senha: '',
    area: '', // só usado por prestador
  });

  const handleChange = (e) => {
    setDados({ ...dados, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dadosFinal = { ...dados, tipo };
    onSubmit(dadosFinal);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4">
      <input
        name="nome"
        placeholder="Nome"
        value={dados.nome}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        placeholder="Email"
        type="email"
        value={dados.email}
        onChange={handleChange}
        required
      />
      <input
        name="senha"
        placeholder="Senha"
        type="password"
        value={dados.senha}
        onChange={handleChange}
        required
      />

      {tipo === 'prestador' && (
        <input
          name="area"
          placeholder="Área de atuação (Ex: Encanador)"
          value={dados.area}
          onChange={handleChange}
          required
        />
      )}

      <button type="submit" className="bg-blue-600 text-white p-2 rounded">
        Cadastrar como {tipo}
      </button>
    </form>
  );
}

export default FormularioCadastro;