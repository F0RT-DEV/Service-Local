import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AutenticacaoLocal";

import Passo1TipoUsuario from "../components/cadastro/Passo1TipoUsuario";
import Passo2DadosBasicos from "../components/cadastro/Passo2DadosBasicos";
import Passo3DadosEspecificos from "../components/cadastro/Passo3DadosEspecificos";

function CadastroMultiStep() {
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [erros, setErros] = useState({});
  const [formData, setFormData] = useState({
    tipo: "", nome: "", email: "", telefone: "", cpf: "", cnpj: "",
    rua: "", numero: "", complemento: "", cep: "", estado: "", cidade: "",
    categorias: [], experiencia: "", descricao: ""
  });

  const { login } = useAuth(); // do contexto
  const navigate = useNavigate();

  const proximaEtapa = () => setEtapaAtual(prev => prev + 1);
  const etapaAnterior = () => setEtapaAtual(prev => prev - 1);

  const handleSelecionarTipo = (tipo) => {
    setFormData(prev => ({ ...prev, tipo }));
    proximaEtapa();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validarPasso2 = () => {
    const novosErros = {};
    if (!formData.nome.trim()) novosErros.nome = "Nome é obrigatório.";
    if (!formData.email.trim()) novosErros.email = "Email é obrigatório.";
    if (!formData.telefone.trim()) novosErros.telefone = "Telefone é obrigatório.";
    if (!formData.cpf.trim()) novosErros.cpf = "CPF é obrigatório.";
    if (!formData.rua.trim()) novosErros.rua = "Rua é obrigatória.";
    if (!formData.numero.trim()) novosErros.numero = "Número é obrigatório.";
    if (!formData.cep.trim()) novosErros.cep = "CEP é obrigatório.";
    if (!formData.estado.trim()) novosErros.estado = "Estado é obrigatório.";
    if (!formData.cidade.trim()) novosErros.cidade = "Cidade é obrigatória.";

    if (formData.tipo === 'prestador' && !formData.cnpj.trim()) {
      novosErros.cnpj = "CNPJ é obrigatório para prestadores.";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const finalizarCadastro = () => {
    const cadastros = JSON.parse(localStorage.getItem("cadastros")) || [];
    const novoCadastro = { ...formData };
    cadastros.push(novoCadastro);
    localStorage.setItem("cadastros", JSON.stringify(cadastros));

    login(novoCadastro); // simula login com contexto

    if (novoCadastro.tipo === 'usuario') {
      navigate('/usuario/dashboard');
    } else if (novoCadastro.tipo === 'prestador') {
      navigate('/prestador/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div>
      {etapaAtual === 1 && (
        <Passo1TipoUsuario
          tipoSelecionado={formData.tipo}
          onSelecionar={handleSelecionarTipo}
          erro={formData.tipo ? null : "Por favor, selecione um tipo de conta"}
        />
      )}
      {etapaAtual === 2 && (
        <Passo2DadosBasicos
          dados={formData}
          onChange={handleChange}
          erros={erros}
          validarPasso2={validarPasso2} // Passa a função diretamente
          proximaEtapa={proximaEtapa} // Adiciona esta prop
          etapaAnterior={etapaAnterior}
          finalizarCadastro={finalizarCadastro}
        />
      )}
      {etapaAtual === 3 && (
        <Passo3DadosEspecificos
          tipo={formData.tipo}
          dados={formData}
          onChange={handleChange}
          erros={erros}
          finalizarCadastro={finalizarCadastro}
          etapaAnterior={etapaAnterior}
        />
      )}
    </div>
  );
}

export default CadastroMultiStep;
