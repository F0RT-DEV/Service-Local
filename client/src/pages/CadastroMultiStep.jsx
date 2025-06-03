import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Passo1TipoUsuario from "../components/cadastro/Passo1TipoUsuario";
import Passo2DadosBasicos from "../components/cadastro/Passo2DadosBasicos";
import Passo3DadosEspecificos from "../components/cadastro/Passo3DadosEspecificos";
import styles from "./CadastroMultiStep.module.css";

function CadastroMultiStep() {
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [erros, setErros] = useState({});
  const [cadastroSucesso, setCadastroSucesso] = useState(false);
  const [formData, setFormData] = useState({
    tipo: "", nome: "", email: "", senha: "", telefone: "", cpf: "", cnpj: "",
    rua: "", numero: "", complemento: "", cep: "", estado: "", cidade: "",
    categorias: [], experiencia: "", descricao: ""
  });

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
    if (!formData.senha.trim()) novosErros.senha = "Senha é obrigatória.";
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

  // Salva o usuário no db.json via POST
  const finalizarCadastro = () => {
    fetch("http://localhost:5000/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao cadastrar usuário");
        return res.json();
      })
      .then(() => {
        setCadastroSucesso(true);
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      })
      .catch(() => {
        setErros({ geral: "Erro ao cadastrar. Tente novamente." });
      });
  };

  return (
    <div className={styles['container']}>
      {cadastroSucesso && (
        <div className={styles['mensagem-sucesso']}>
          CADASTRO REALIZADO COM SUCESSO!
        </div>
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
      {erros.geral && (
        <div className={styles['mensagem-erro']}>{erros.geral}</div>
      )}
    </div>
  );
}

export default CadastroMultiStep;