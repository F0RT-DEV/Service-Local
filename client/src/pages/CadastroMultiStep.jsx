import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Passo1TipoUsuario from "../components/cadastro/Passo1TipoUsuario";
import Passo2DadosBasicos from "../components/cadastro/Passo2DadosBasicos";
import Passo3DadosEspecificos from "../components/cadastro/Passo3DadosEspecificos";
import styles from "./CadastroMultiStep.module.css";

function CadastroMultiStep() {
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [erros, setErros] = useState({});
  const [cadastroSucesso, setCadastroSucesso] = useState(false);
  const [formData, setFormData] = useState({
    tipo: "",
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    cpf: "",
    cnpj: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cep: "",
    estado: "",
    cidade: "",
    categorias: [],
    experiencia: "",
    descricao: "",
    bio: "",
  });

  const navigate = useNavigate();

const proximaEtapa = () => {
  setEtapaAtual((prev) => {
    return prev + 1;
  });
};
  const etapaAnterior = () => setEtapaAtual((prev) => prev - 1);

const handleSelecionarTipo = (tipo) => {
  setFormData((prev) => ({ ...prev, tipo }));
  setEtapaAtual(2); // Corrigido: vai direto para o passo 2
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validarPasso2 = () => {
    const novosErros = {};
    if (!formData.nome.trim()) novosErros.nome = "Nome é obrigatório.";
    if (!formData.email.trim()) novosErros.email = "Email é obrigatório.";
    if (!formData.senha.trim()) novosErros.senha = "Senha é obrigatória.";
    if (!formData.telefone.trim()) novosErros.telefone = "Telefone é obrigatório.";
    if (!formData.cpf.trim()) novosErros.cpf = "CPF é obrigatório.";
    if (!formData.rua.trim()) novosErros.rua = "Rua é obrigatória.";
    if (!formData.numero.trim()) novosErros.numero = "Número é obrigatório.";
    if (!formData.bairro.trim()) novosErros.bairro = "Bairro é obrigatório.";
    if (!formData.cep.trim()) novosErros.cep = "CEP é obrigatório.";
    if (!formData.estado.trim()) novosErros.estado = "Estado é obrigatório.";
    if (!formData.cidade.trim()) novosErros.cidade = "Cidade é obrigatória.";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // Cadastro de usuário comum
  const finalizarCadastroUsuario = async () => {
    try {
      const payload = {
        name: formData.nome,
        email: formData.email,
        password: formData.senha,
        phone: formData.telefone,
        role: formData.tipo === "admin" ? "admin" : "client",
        cpf: formData.cpf,
        cep: formData.cep,
        logradouro: formData.rua,
        complemento: formData.complemento,
        bairro: formData.bairro,
        localidade: formData.cidade,
        uf: formData.estado,
        numero: formData.numero,
      };

      await axios.post("http://localhost:3333/register", payload);
      setCadastroSucesso(true);
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setErros({ geral: err.response?.data?.error || "Erro ao cadastrar. Tente novamente." });
    }
  };

const finalizarCadastroPrestador = async () => {
  try {
    // 1. Cadastro do usuário (role: provider)
    const userPayload = {
      name: formData.nome,
      email: formData.email,
      password: formData.senha,
      phone: formData.telefone,
      role: "provider",
      cpf: formData.cpf,
      cep: formData.cep,
      logradouro: formData.rua,
      complemento: formData.complemento,
      bairro: formData.bairro,
      localidade: formData.cidade,
      uf: formData.estado,
      numero: formData.numero,
    };

    await axios.post("http://localhost:3333/register", userPayload);

    // 2. Login para obter token
    const loginRes = await axios.post("http://localhost:3333/login", {
      email: formData.email,
      password: formData.senha,
    });
    const token = loginRes.data.token;

    // 3. Atualiza dados específicos do provider
    await axios.put(
      "http://localhost:3333/provider",
      {
        bio: formData.descricao,
        cnpj: formData.cnpj,
        categories: formData.categorias, // array de IDs
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setCadastroSucesso(true);
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  } catch (err) {
    setErros({ geral: err.response?.data?.error || "Erro ao cadastrar. Tente novamente." });
  }
};

  // Decide qual finalizar chamar
  const finalizarCadastro = async () => {
  if (formData.tipo === "usuario" || formData.tipo === "admin") {
    await finalizarCadastroUsuario();
  } else {
    await finalizarCadastroPrestador();
  }
};

  return (
    <div className={styles["container"]}>
      {cadastroSucesso && (
        <div className={styles["mensagem-sucesso"]}>CADASTRO REALIZADO COM SUCESSO!</div>
      )}
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
  validarPasso2={validarPasso2}
  proximaEtapa={proximaEtapa}
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
      {erros.geral && <div className={styles["mensagem-erro"]}>{erros.geral}</div>}
    </div>
  );
}

export default CadastroMultiStep;