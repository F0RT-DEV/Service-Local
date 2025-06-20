import React, {useState, useEffect} from "react";
import axios from "axios";
import styles from "./PerfilPrestador.module.css";

const PerfilPrestador = () => {
	const [aba, setAba] = useState("perfil");
	const [dados, setDados] = useState(null);
	const [editando, setEditando] = useState(false);
	const [form, setForm] = useState({
		bio: "",
		cnpj: "",
		categorias: [],
	});
	const [categorias, setCategorias] = useState([]);
	const [mensagem, setMensagem] = useState("");
	const [errosPerfil, setErrosPerfil] = useState({});
	const [ordens, setOrdens] = useState([]);
	const [avaliacoes, setAvaliacoes] = useState([]);

	useEffect(() => {
		const token = localStorage.getItem("token");
		axios
			.get("http://localhost:3333/me", {
				headers: {Authorization: `Bearer ${token}`},
			})
			.then((res) => {
				const {user, provider} = res.data;
				const userWithExtras = {
					...user,
					providerStatus: provider?.status || null,
					experience: provider?.experience || "",
				};
				setDados(userWithExtras);
				if (provider) {
					setForm({
						bio: provider.bio || "",
						cnpj: provider.cnpj || "",
						categorias: provider.categories?.map((c) => c.id) || [],
					});
				}
			});
	}, []);

	useEffect(() => {
		axios
			.get("http://localhost:3333/categories")
			.then((res) => setCategorias(res.data));
	}, []);

	useEffect(() => {
		if (!dados?.id || aba !== "ordens") return;
		axios
			.get(`http://localhost:3333/orders?provider_id=${dados.id}`)
			.then((res) => setOrdens(res.data));
	}, [dados?.id, aba]);

	useEffect(() => {
		if (!dados?.id || aba !== "avaliacoes") return;
		axios
			.get(`http://localhost:3333/reviews?provider_id=${dados.id}`)
			.then((res) => setAvaliacoes(res.data))
			.catch(() => setAvaliacoes([]));
	}, [dados?.id, aba]);

	const validarPerfil = () => {
		const erros = {};
		if (!form.bio || form.bio.trim().length < 10)
			erros.bio = "A bio deve ter pelo menos 10 caracteres.";
		if (!form.categorias || form.categorias.length === 0)
			erros.categorias = "Selecione pelo menos uma categoria.";
		setErrosPerfil(erros);
		return Object.keys(erros).length === 0;
	};

	const handleChange = (e) => {
		const {name, value, checked} = e.target;
		if (name === "categorias") {
			const novasCategorias = checked
				? [...form.categorias, value]
				: form.categorias.filter((cat) => cat !== value);
			setForm((prev) => ({...prev, categorias: novasCategorias}));
		} else {
			setForm((prev) => ({...prev, [name]: value}));
		}
	};

	const handleSalvar = async (e) => {
		e.preventDefault();
		setMensagem("");
		if (!validarPerfil()) {
			setMensagem("Preencha todos os campos obrigatórios do perfil.");
			return;
		}
		try {
			const token = localStorage.getItem("token");
			await axios.put(
				"http://localhost:3333/provider",
				{
					bio: form.bio,
					cnpj: form.cnpj,
					categories: form.categorias,
				},
				{headers: {Authorization: `Bearer ${token}`}}
			);
			setMensagem("Perfil atualizado com sucesso!");
			setEditando(false);
		} catch (error) {
			setMensagem("Erro ao atualizar perfil.");
		}
	};

	if (!dados)
		return <div className={styles.dashboardPrestador}>Carregando...</div>;

	return (
		<div className={styles.dashboardPrestador}>
			<header className={styles.header}>
				<h1 className={styles.titulo}>Perfil do Prestador</h1>
				<nav className={styles.navegacao}>
					<button
						onClick={() => setAba("perfil")}
						className={`${styles.botaoNavegacao} ${
							aba === "perfil" ? styles.ativo : ""
						}`}
					>
						Perfil do Prestador
					</button>
					<button
						onClick={() => setAba("ordens")}
						className={`${styles.botaoNavegacao} ${
							aba === "ordens" ? styles.ativo : ""
						}`}
					>
						Histórico de Ordens
					</button>
					<button
						onClick={() => setAba("avaliacoes")}
						className={`${styles.botaoNavegacao} ${
							aba === "avaliacoes" ? styles.ativo : ""
						}`}
					>
						Avaliações Recebidas
					</button>
				</nav>
			</header>

			<main className={styles.conteudoPrincipal}>
				{aba === "perfil" && (
					<section className={styles.secaoPerfil}>
						<h2 className={styles.subtitulo}>Dados do Prestador</h2>
						{!editando ? (
							<div className={styles.perfilDados}>
								<div className={styles.dadoItem}>
									<span className={styles.dadoLabel}>Nome:</span>
									<p className={styles.dadoValor}>{dados.name}</p>
								</div>
								<div className={styles.dadoItem}>
									<span className={styles.dadoLabel}>Email:</span>
									<p className={styles.dadoValor}>{dados.email}</p>
								</div>
								<div className={styles.dadoItem}>
									<span className={styles.dadoLabel}>Telefone:</span>
									<p className={styles.dadoValor}>{dados.phone}</p>
								</div>
								<div className={styles.dadoItem}>
									<span className={styles.dadoLabel}>CPF:</span>
									<p className={styles.dadoValor}>{dados.cpf || "-"}</p>
								</div>
								<div className={styles.dadoItem}>
									<span className={styles.dadoLabel}>CNPJ:</span>
									<p className={styles.dadoValor}>{form.cnpj || "-"}</p>
								</div>
								<div className={styles.dadoItem}>
									<span className={styles.dadoLabel}>Endereço:</span>
									<p className={styles.dadoValor}>
										{dados.logradouro || "-"}, {dados.numero || "-"}{" "}
										{dados.complemento && `- ${dados.complemento}`}
									</p>
								</div>
								<div className={styles.dadoItem}>
									<span className={styles.dadoLabel}>Bairro:</span>
									<p className={styles.dadoValor}>{dados.bairro || "-"}</p>
								</div>
								<div className={styles.dadoItem}>
									<span className={styles.dadoLabel}>CEP:</span>
									<p className={styles.dadoValor}>{dados.cep || "-"}</p>
								</div>
								<div className={styles.dadoItem}>
									<span className={styles.dadoLabel}>Cidade:</span>
									<p className={styles.dadoValor}>{dados.localidade || "-"}</p>
								</div>
								<div className={styles.dadoItem}>
									<span className={styles.dadoLabel}>Estado:</span>
									<p className={styles.dadoValor}>{dados.uf || "-"}</p>
								</div>
								<div className={styles.dadoItem}>
									<span className={styles.dadoLabel}>Status:</span>
									<p className={styles.dadoValor}>
										{dados.providerStatus || "-"}
									</p>
								</div>
								<div className={styles.dadoItem}>
									<span className={styles.dadoLabel}>Bio:</span>
									<p className={styles.dadoValor}>{form.bio || "-"}</p>
								</div>
								<div className={styles.dadoItem}>
									<span className={styles.dadoLabel}>Categorias:</span>
									<p className={styles.dadoValor}>
										{categorias
											.filter((cat) => form.categorias.includes(cat.id))
											.map((cat) => cat.name)
											.join(", ") || "-"}
									</p>
								</div>
								<button
									className={styles.botaoPrimario}
									onClick={() => setEditando(true)}
								>
									{form.bio && form.categorias.length > 0
										? "Editar Perfil"
										: "Completar Perfil"}
								</button>
							</div>
						) : (
							<form className={styles.formulario} onSubmit={handleSalvar}>
								<div className={styles.grupoFormulario}>
									<label htmlFor="bio" className={styles.rotulo}>
										Bio <span style={{color: "red"}}>*</span>
									</label>
									<textarea
										id="bio"
										name="bio"
										value={form.bio}
										onChange={handleChange}
										rows={3}
										className={`${styles.entradaTexto} ${
											errosPerfil.bio ? styles.inputErro : ""
										}`}
									/>
									{errosPerfil.bio && (
										<span className={styles.mensagemErro}>
											{errosPerfil.bio}
										</span>
									)}
								</div>
								<div className={styles.grupoFormulario}>
									<label className={styles.rotulo}>
										Áreas de atuação <span style={{color: "red"}}>*</span>
									</label>
									<div className={styles.grupoCheckbox}>
										{categorias.map((cat) => (
											<div key={cat.id} className={styles.opcaoCheckbox}>
												<input
													type="checkbox"
													id={`cat-${cat.id}`}
													name="categorias"
													value={cat.id}
													checked={form.categorias.includes(String(cat.id))}
													onChange={handleChange}
													className={styles.checkbox}
												/>
												<label
													htmlFor={`cat-${cat.id}`}
													className={styles.rotuloCheckbox}
												>
													{cat.name}
												</label>
											</div>
										))}
									</div>
									{errosPerfil.categorias && (
										<span className={styles.mensagemErro}>
											{errosPerfil.categorias}
										</span>
									)}
								</div>

								<div className={styles.grupoFormulario}>
									<label htmlFor="cnpj" className={styles.rotulo}>
										CNPJ
									</label>
									<input
										id="cnpj"
										name="cnpj"
										value={form.cnpj}
										onChange={handleChange}
										className={styles.entradaTexto}
									/>
								</div>
								<div className={styles.acoesFormulario}>
									<button type="submit" className={styles.botaoPrimario}>
										Salvar
									</button>
									<button
										type="button"
										onClick={() => setEditando(false)}
										className={styles.botaoSecundario}
									>
										Cancelar
									</button>
								</div>
							</form>
						)}
					</section>
				)}

				{aba === "ordens" && (
					<section>
						<h2 className={styles.subtitulo}>Histórico de Ordens</h2>
						<div className={styles["ordens-lista"]}>
							{ordens.length === 0 ? (
								<p>Nenhuma ordem encontrada.</p>
							) : (
								ordens.map((ordem) => (
									<div key={ordem.id} className={styles["ordem-card"]}>
										<p>
											<strong>Serviço:</strong> {ordem.servicoTitulo}
										</p>
										<p>
											<strong>Status:</strong> {ordem.status}
										</p>
										<p>
											<strong>Cliente:</strong> {ordem.clienteNome}
										</p>
									</div>
								))
							)}
						</div>
					</section>
				)}

				{aba === "avaliacoes" && (
					<section>
						<h2 className={styles.subtitulo}>Avaliações Recebidas</h2>
						<div>
							{avaliacoes.length === 0 ? (
								<p>Nenhuma avaliação recebida.</p>
							) : (
								avaliacoes.map((av) => (
									<div key={av.id} className={styles.avaliacaoCard}>
										<strong>{av.rating} ⭐</strong>
										<p>{av.comment}</p>
									</div>
								))
							)}
						</div>
					</section>
				)}
			</main>
			{mensagem && <div className={styles.mensagem}>{mensagem}</div>}
		</div>
	);
};

export default PerfilPrestador;
