import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Passo1TipoUsuario from "../components/cadastro/Passo1TipoUsuario";
import Passo2DadosBasicos from "../components/cadastro/Passo2DadosBasicos";
import Passo3DadosEspecificos from "../components/cadastro/Passo3DadosEspecificos";
import ProgressoCadastro from "../components/cadastro/ProgressoCadastro";
import { useAuth } from "../context/AutenticacaoLocal";
import "./CadastroMultiStep.css";

const CadastroMultiStep = () => {
  const [passo, setPasso] = useState(1);
  const [dadosCadastro, setDadosCadastro] = useState({
    tipo: "",
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    // Campos específicos para prestador
    area: "",
    experiencia: "",
    descricao: "",
    // Campos específicos para usuário comum
    endereco: "",
    cidade: "",
    estado: "",
  });
  const [erros, setErros] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();

  const validarPasso1 = () => {
    if (!dadosCadastro.tipo) {
      setErros({ tipo: "Por favor, selecione um tipo de usuário" });
      return false;
    }
    setErros({});
    return true;
  };

  const validarPasso2 = () => {
    const novosErros = {};

    if (!dadosCadastro.nome.trim()) novosErros.nome = "Nome é obrigatório";
    if (!dadosCadastro.email.trim()) novosErros.email = "Email é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(dadosCadastro.email))
      novosErros.email = "Email inválido";
    if (!dadosCadastro.senha.trim()) novosErros.senha = "Senha é obrigatória";
    else if (dadosCadastro.senha.length < 6)
      novosErros.senha = "Senha deve ter pelo menos 6 caracteres";
    if (!dadosCadastro.telefone.trim())
      novosErros.telefone = "Telefone é obrigatório";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const validarPasso3 = () => {
    const novosErros = {};

    if (dadosCadastro.tipo === "prestador") {
      if (!dadosCadastro.area.trim())
        novosErros.area = "Área de atuação é obrigatória";
      if (!dadosCadastro.experiencia.trim())
        novosErros.experiencia = "Experiência é obrigatória";
      if (!dadosCadastro.descricao.trim())
        novosErros.descricao = "Descrição dos serviços é obrigatória";
    } else {
      if (!dadosCadastro.endereco.trim())
        novosErros.endereco = "Endereço é obrigatório";
      if (!dadosCadastro.cidade.trim())
        novosErros.cidade = "Cidade é obrigatória";
      if (!dadosCadastro.estado.trim())
        novosErros.estado = "Estado é obrigatório";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const avancarPasso = () => {
    let valido = false;

    switch (passo) {
      case 1:
        valido = validarPasso1();
        break;
      case 2:
        valido = validarPasso2();
        break;
      default:
        valido = true;
    }

    if (valido) {
      setPasso(passo + 1);
      window.scrollTo(0, 0);
    }
  };

  const voltarPasso = () => {
    setPasso(passo - 1);
    window.scrollTo(0, 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDadosCadastro((prev) => ({ ...prev, [name]: value }));

    // Limpar erro do campo que foi alterado
    if (erros[name]) {
      setErros((prev) => {
        const novosErros = { ...prev };
        delete novosErros[name];
        return novosErros;
      });
    }
  };

  const handleTipoUsuario = (tipo) => {
    setDadosCadastro((prev) => ({ ...prev, tipo }));
    setErros({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validarPasso3()) {
      // Salva no localStorage
      const cadastrosSalvos =
        JSON.parse(localStorage.getItem("cadastros")) || [];
      cadastrosSalvos.push(dadosCadastro);
      localStorage.setItem("cadastros", JSON.stringify(cadastrosSalvos));

      // Login simulado
      login(dadosCadastro.tipo, dadosCadastro.nome);

      // Redirecionar
      navigate(
        dadosCadastro.tipo === "prestador"
          ? "/prestador/dashboard"
          : "/usuario/dashboard"
      );
    }
  };

  const renderPasso = () => {
    switch (passo) {
      case 1:
        return (
          <Passo1TipoUsuario
            tipoSelecionado={dadosCadastro.tipo}
            onSelecionar={handleTipoUsuario}
            erro={erros.tipo}
          />
        );
      case 2:
        return (
          <Passo2DadosBasicos
            dados={dadosCadastro}
            onChange={handleChange}
            erros={erros}
          />
        );
      case 3:
        return (
          <Passo3DadosEspecificos
            tipo={dadosCadastro.tipo}
            dados={dadosCadastro}
            onChange={handleChange}
            erros={erros}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="cadastro-container">
      <h1 className="text-2xl font-bold text-center mb-6">Crie sua conta</h1>

      <ProgressoCadastro passoAtual={passo} totalPassos={3} />

      <form onSubmit={passo === 3 ? handleSubmit : (e) => e.preventDefault()}>
        {renderPasso()}

        <div className="flex justify-between mt-8">
          {passo > 1 && (
            <button
              type="button"
              onClick={voltarPasso}
              className="btn-secundario"
            >
              Voltar
            </button>
          )}

          {passo < 3 ? (
            <button
              type="button"
              onClick={avancarPasso}
              className="btn-primario ml-auto"
            >
              Continuar
            </button>
          ) : (
            <button type="submit" className="btn-primario ml-auto">
              Finalizar Cadastro
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CadastroMultiStep;
