import React, {useState, useEffect} from "react";
import styles from "./DashboardPrestador.module.css";

const getUsuarioLocal = () => {
	try {
		const usuario = localStorage.getItem("usuario");
		return usuario ? JSON.parse(usuario) : null;
	} catch {
		return null;
	}
};

const DashboardPrestador = () => {
	const usuario = getUsuarioLocal();
	const [abaAtual, setAbaAtual] = useState("cadastrar-servico");
	const [provider, setProvider] = useState(undefined);
	const [categorias, setCategorias] = useState([]);
	const [mensagem, setMensagem] = useState("");
	const [showSuccessPopup, setShowSuccessPopup] = useState(false);

	const [novoServico, setNovoServico] = useState({
		title: "",
		description: "",
		category_id: "",
		price_min: "",
		price_max: "",
		images: "",
		is_active: true,
	});

	const [servicosPrestador, setServicosPrestador] = useState([]);
	const [ordens, setOrdens] = useState([]);

	// Buscar categorias
	useEffect(() => {
		fetch("http://localhost:3333/categories")
			.then((res) => res.json())
			.then(setCategorias)
			.catch(() => setCategorias([]));
	}, []);

	// Buscar provider do usuário
	useEffect(() => {
		if (!usuario?.id) {
			setProvider(null);
			return;
		}
		let cancelado = false;
		fetch(`http://localhost:3333/providers?user_id=${usuario.id}`)
			.then((res) => res.json())
			.then((data) => {
				const prov = Array.isArray(data) ? data[0] : data;
				if (!cancelado) setProvider(prov || null);
			})
			.catch(() => {
				if (!cancelado) setProvider(null);
			});
		return () => {
			cancelado = true;
		};
	}, [usuario?.id]);

	// Buscar serviços do próprio prestador usando /services/me
	useEffect(() => {
		if (abaAtual === "cadastrar-servico" || abaAtual === "buscar-servicos") {
			const token = localStorage.getItem("token");
			fetch("http://localhost:3333/services/me", {
				headers: {
					Authorization: token ? `Bearer ${token}` : undefined,
				},
			})
				.then((res) => res.json())
				.then((data) => setServicosPrestador(Array.isArray(data) ? data : []))
				.catch(() => setServicosPrestador([]));
		}
	}, [abaAtual]);

	// Buscar serviços do próprio prestador para ambas as abas
	useEffect(() => {
		if (
			(abaAtual === "cadastrar-servico" || abaAtual === "buscar-servicos") &&
			provider?.id
		) {
			const token = localStorage.getItem("token");
			fetch(`http://localhost:3333/providers/${provider.id}/services`, {
				headers: {
					Authorization: token ? `Bearer ${token}` : undefined,
				},
			})
				.then((res) => res.json())
				.then(setServicosPrestador)
				.catch(() => setServicosPrestador([]));
		}
	}, [abaAtual, provider?.id]);

	// Buscar ordens de serviço do prestador
	// ...dentro do useEffect de buscar ordens...
	useEffect(() => {
		async function fetchOrdensCompletas() {
			if (abaAtual === "os") {
				const token = localStorage.getItem("token");
				try {
					const res = await fetch("http://localhost:3333/providers/orders", {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});

					if (!res.ok) {
						const erro = await res.json();
						console.error("Erro ao buscar ordens:", erro);
						setOrdens([]);
						return;
					}

					const ordens = await res.json();
					setOrdens(Array.isArray(ordens) ? ordens : []);
				} catch (err) {
					console.error("Erro na requisição de ordens:", err);
					setOrdens([]);
				}
			}
		}

		fetchOrdensCompletas();

		// Aceitar ordem
		window.handleAceitarOrdem = async (orderId) => {
			const token = localStorage.getItem("token");
			try {
				await fetch(
					`http://localhost:3333/providers/orders/${orderId}/accept`,
					{
						method: "PATCH",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				await fetchOrdensCompletas();
			} catch (error) {
				console.error("Erro ao aceitar ordem:", error);
			}
		};

		// Rejeitar ordem
		window.handleRejeitarOrdem = async (orderId) => {
			const token = localStorage.getItem("token");
			try {
				await fetch(
					`http://localhost:3333/providers/orders/${orderId}/reject`,
					{
						method: "PATCH",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				await fetchOrdensCompletas();
			} catch (error) {
				console.error("Erro ao rejeitar ordem:", error);
			}
		};

		// Iniciar ordem
		window.handleIniciarOrdem = async (orderId) => {
			const token = localStorage.getItem("token");
			try {
				await fetch(
					`http://localhost:3333/providers/orders/${orderId}/progress`,
					{
						method: "PATCH",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				await fetchOrdensCompletas();
			} catch (error) {
				console.error("Erro ao iniciar ordem:", error);
			}
		};

		// Completar ordem
		window.handleCompletarOrdem = async (orderId) => {
			const token = localStorage.getItem("token");
			try {
				await fetch(
					`http://localhost:3333/providers/orders/${orderId}/complete`,
					{
						method: "PATCH",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				await fetchOrdensCompletas();
			} catch (error) {
				console.error("Erro ao completar ordem:", error);
			}
		};
	}, [abaAtual]);

	// Cadastro de serviço
	const handleCadastrarServico = async (e) => {
		e.preventDefault();

		if (
			!novoServico.title ||
			!novoServico.description ||
			!novoServico.category_id ||
			novoServico.price_min === "" ||
			novoServico.price_max === ""
		) {
			setMensagem("Preencha todos os campos obrigatórios.");
			return;
		}

		if (novoServico.description.length < 10) {
			setMensagem("A descrição deve ter pelo menos 10 caracteres.");
			return;
		}

		const priceMin = parseFloat(novoServico.price_min);
		const priceMax = parseFloat(novoServico.price_max);
		const isActive = !!novoServico.is_active;

		if (isNaN(priceMin) || isNaN(priceMax)) {
			setMensagem("Preços devem ser números válidos.");
			return;
		}

		try {
			const payload = {
				category_id: novoServico.category_id,
				title: novoServico.title,
				description: novoServico.description,
				price_min: priceMin,
				price_max: priceMax,
				images: novoServico.images,
				is_active: isActive,
			};

			const token = localStorage.getItem("token");

			const response = await fetch("http://localhost:3333/services", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: token ? `Bearer ${token}` : undefined,
				},
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				const erro = await response.json();
				alert(
					"Erro ao cadastrar serviço:\n" +
						(erro.details
							? JSON.stringify(erro.details, null, 2)
							: erro.error || "Erro desconhecido")
				);
				setMensagem(
					(erro.details && JSON.stringify(erro.details)) ||
						erro.error ||
						"Erro ao cadastrar serviço."
				);
				throw new Error(erro.error || "Erro ao cadastrar serviço.");
			}

			const novoServicoCadastrado = await response.json();
			setMensagem("Serviço cadastrado com sucesso!");
			setNovoServico({
				title: "",
				description: "",
				category_id: "",
				price_min: "",
				price_max: "",
				images: "",
				is_active: true,
			});
			setServicosPrestador((prev) => [...prev, novoServicoCadastrado]);
			setShowSuccessPopup(true);
			setTimeout(() => setShowSuccessPopup(false), 2500);
		} catch (error) {
			setMensagem(error.message || "Erro ao cadastrar serviço.");
		}
	};

	// Função utilitária para renderizar imagens
	const renderImagens = (images) => {
		if (Array.isArray(images)) {
			return (
				<div className={styles.tdImagens}>
					{images.map((img, idx) =>
						img && img.trim() ? (
							<img key={idx} src={img.trim()} alt="Serviço" />
						) : null
					)}
				</div>
			);
		}
		if (typeof images === "string" && images.trim() !== "") {
			return (
				<div className={styles.tdImagens}>
					{images
						.split(",")
						.map((img, idx) =>
							img.trim() ? (
								<img key={idx} src={img.trim()} alt="Serviço" />
							) : null
						)}
				</div>
			);
		}
		return <span>-</span>;
	};

	// Aceitar ordem
	const handleAceitarOrdem = (orderId) => {
		const token = localStorage.getItem("token");
		fetch(`http://localhost:3333/provider/orders/${orderId}/accept`, {
			method: "PATCH",
			headers: {Authorization: `Bearer ${token}`},
		})
			.then((res) => res.json())
			.then(() => {
				setMensagem("Ordem aceita!");
				// Atualiza ordens
				fetch(`http://localhost:3333/orders?provider_id=${usuario.id}`)
					.then((res) => res.json())
					.then(setOrdens);
			});
	};

	// Rejeitar ordem
	const handleRejeitarOrdem = (orderId) => {
		const token = localStorage.getItem("token");
		fetch(`http://localhost:3333/provider/orders/${orderId}/reject`, {
			method: "PATCH",
			headers: {Authorization: `Bearer ${token}`},
		})
			.then((res) => res.json())
			.then(() => {
				setMensagem("Ordem rejeitada!");
				// Atualiza ordens
				// Supondo que provider.id é o id do provider
				fetch(`http://localhost:3333/orders?provider_id=${provider.id}`)
					.then((res) => res.json())
					.then(setOrdens);
			});
	};

	if (!usuario) {
		return (
			<div className={styles.dashboardPrestador}>
				Faça login para acessar o painel do prestador.
			</div>
		);
	}

	if (provider === undefined) {
		return (
			<div className={styles.dashboardPrestador}>
				Carregando dados do prestador. Aguarde...
			</div>
		);
	}

	if (provider === null) {
		return (
			<div className={styles.dashboardPrestador}>
				<div style={{color: "red", marginTop: 16}}>
					Você ainda não possui perfil de prestador.
					<br />
					Solicite ao administrador a criação do seu perfil de prestador.
				</div>
			</div>
		);
	}

	return (
		<div className={styles.dashboardPrestador}>
			{/* Popup de sucesso */}
			{showSuccessPopup && (
				<div
					style={{
						position: "fixed",
						top: "30px",
						left: "50%",
						transform: "translateX(-50%)",
						background: "#22c55e",
						color: "#fff",
						padding: "18px 32px",
						borderRadius: "10px",
						fontWeight: "bold",
						fontSize: "1.1rem",
						zIndex: 9999,
						boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
					}}
				>
					O serviço foi cadastrado com sucesso!
				</div>
			)}

			<header className={styles.header}>
				<h1 className={styles.titulo}>Bem-vindo!</h1>
				<nav className={styles.navegacao}>
					<button
						onClick={() => setAbaAtual("cadastrar-servico")}
						className={`${styles.botaoNavegacao} ${
							abaAtual === "cadastrar-servico" ? styles.ativo : ""
						}`}
					>
						Cadastrar Serviço
					</button>
					<button
						onClick={() => setAbaAtual("buscar-servicos")}
						className={`${styles.botaoNavegacao} ${
							abaAtual === "buscar-servicos" ? styles.ativo : ""
						}`}
					>
						Meus Serviços
					</button>
					<button
						onClick={() => setAbaAtual("os")}
						className={`${styles.botaoNavegacao} ${
							abaAtual === "os" ? styles.ativo : ""
						}`}
					>
						Ordens de Serviço
					</button>
				</nav>
			</header>

			{mensagem && (
				<div
					className={`${styles.mensagem} ${
						mensagem.includes("sucesso") ? styles.sucesso : styles.erro
					}`}
				>
					{mensagem}
				</div>
			)}

			<main className={styles.conteudoPrincipal}>
				{abaAtual === "cadastrar-servico" && (
					<section className={styles.secaoServico}>
						<form
							className={styles.formulario}
							onSubmit={handleCadastrarServico}
						>
							<h3 className={styles.subtitulo}>Cadastrar Novo Serviço</h3>
							<div className={styles.grupoFormulario}>
								<label htmlFor="title" className={styles.rotulo}>
									Título do Serviço
								</label>
								<input
									id="title"
									name="title"
									value={novoServico.title}
									onChange={(e) =>
										setNovoServico((prev) => ({
											...prev,
											title: e.target.value,
										}))
									}
									required
									className={styles.entradaTexto}
								/>
							</div>
							<div className={styles.grupoFormulario}>
								<label htmlFor="description" className={styles.rotulo}>
									Descrição
								</label>
								<textarea
									id="description"
									name="description"
									value={novoServico.description}
									onChange={(e) =>
										setNovoServico((prev) => ({
											...prev,
											description: e.target.value,
										}))
									}
									required
									className={styles.entradaTexto}
								/>
							</div>
							<div className={styles.grupoFormulario}>
								<label htmlFor="category_id" className={styles.rotulo}>
									Categoria
								</label>
								<select
									id="category_id"
									name="category_id"
									value={novoServico.category_id}
									onChange={(e) =>
										setNovoServico((prev) => ({
											...prev,
											category_id: e.target.value,
										}))
									}
									required
									className={styles.entradaTexto}
								>
									<option value="">Selecione uma categoria</option>
									{categorias.map((cat) => (
										<option key={cat.id} value={cat.id}>
											{cat.name}
										</option>
									))}
								</select>
							</div>
							<div className={styles.grupoFormulario}>
								<label htmlFor="price_min" className={styles.rotulo}>
									Preço Mínimo (R$)
								</label>
								<input
									id="price_min"
									name="price_min"
									type="number"
									min="0"
									value={novoServico.price_min}
									onChange={(e) =>
										setNovoServico((prev) => ({
											...prev,
											price_min: e.target.value,
										}))
									}
									required
									className={styles.entradaTexto}
								/>
							</div>
							<div className={styles.grupoFormulario}>
								<label htmlFor="price_max" className={styles.rotulo}>
									Preço Máximo (R$)
								</label>
								<input
									id="price_max"
									name="price_max"
									type="number"
									min="0"
									value={novoServico.price_max}
									onChange={(e) =>
										setNovoServico((prev) => ({
											...prev,
											price_max: e.target.value,
										}))
									}
									required
									className={styles.entradaTexto}
								/>
							</div>
							<div className={styles.grupoFormulario}>
								<label htmlFor="images" className={styles.rotulo}>
									Imagens (URL ou texto, separadas por vírgula)
								</label>
								<input
									id="images"
									name="images"
									value={novoServico.images}
									onChange={(e) =>
										setNovoServico((prev) => ({
											...prev,
											images: e.target.value,
										}))
									}
									className={styles.entradaTexto}
									placeholder="URL da imagem ou deixe em branco"
								/>
							</div>
							<div className={styles.grupoFormulario}>
								<label htmlFor="is_active" className={styles.rotulo}>
									Ativo?
								</label>
								<input
									id="is_active"
									name="is_active"
									type="checkbox"
									checked={novoServico.is_active}
									onChange={(e) =>
										setNovoServico((prev) => ({
											...prev,
											is_active: e.target.checked,
										}))
									}
									className={styles.checkbox}
								/>
							</div>
							<button type="submit" className={styles.botaoPrimario}>
								Cadastrar
							</button>
						</form>
					</section>
				)}

				{abaAtual === "buscar-servicos" && (
					<section className={styles.secaoServico}>
						<h2 className={styles.subtitulo}>Meus Serviços</h2>
						{servicosPrestador.length === 0 ? (
							<p>Nenhum serviço cadastrado.</p>
						) : (
							<table className={styles.ordensTabela}>
								<thead>
									<tr>
										<th>Título</th>
										<th>Descrição</th>
										<th>Categoria</th>
										<th>Preço Mínimo</th>
										<th>Preço Máximo</th>
										<th>Imagens</th>
										<th>Ativo?</th>
									</tr>
								</thead>
								<tbody>
									{servicosPrestador.map((servico) => (
										<tr key={servico.id}>
											<td>{servico.title}</td>
											<td>{servico.description}</td>
											<td>
												{categorias.find((c) => c.id === servico.category_id)
													?.name || servico.category_id}
											</td>
											<td>{servico.price_min}</td>
											<td>{servico.price_max}</td>
											<td>{renderImagens(servico.images)}</td>
											<td>{servico.is_active ? "Sim" : "Não"}</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</section>
				)}

				{abaAtual === "os" && (
					<section>
						<h2 className={styles.subtitulo}>Ordens de Serviço</h2>
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
											<strong>Status:</strong>{" "}
											{ordem.status === "pending" && "Aguardando sua aprovação"}
											{ordem.status === "accepted" && "Aprovada"}
											{ordem.status === "rejected" && "Rejeitada"}
											{ordem.status === "in_progress" && "Em andamento"}
											{ordem.status === "completed" && "Finalizada"}
										</p>
										<p>
											<strong>Serviço:</strong> {ordem.service_name}
										</p>
										<p>
											<strong>Cliente:</strong> {ordem.client_name}
										</p>
										{/* Só mostra botões se estiver pendente */}
										{ordem.status === "pending" && (
											<div className={styles.ordemActions}>
												<button
													className={styles.btnAceitar}
													onClick={() => handleAceitarOrdem(ordem.id)}
												>
													Aceitar
												</button>
												<button
													className={styles.btnRejeitar}
													onClick={() => handleRejeitarOrdem(ordem.id)}
												>
													Rejeitar
												</button>
											</div>
										)}
									</div>
								))
							)}
						</div>
					</section>
				)}
			</main>
		</div>
	);
};

export default DashboardPrestador;
