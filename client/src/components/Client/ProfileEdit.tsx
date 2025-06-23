import React, {useEffect, useState} from "react";
import {useAuth} from "../../contexts/AuthContext";
import {Pencil, Save, XCircle} from "lucide-react";

export function ProfileEdit() {
	const {user, setUser} = useAuth();
	const token = localStorage.getItem("token");

	const [form, setForm] = useState({
		name: "",
		email: "",
		phone: "",
		cpf: "",
		cep: "",
		logradouro: "",
		complemento: "",
		bairro: "",
		localidade: "",
		uf: "",
		numero: "",
	});

	const [loading, setLoading] = useState(false);
	const [msg, setMsg] = useState("");
	const [error, setError] = useState("");
	const [editMode, setEditMode] = useState(false);

	useEffect(() => {
		if (user) {
			setForm({
				name: user.name || "",
				email: user.email || "",
				phone: user.phone || "",
				cpf: user.cpf || "",
				cep: user.cep || "",
				logradouro: user.logradouro || "",
				complemento: user.complemento || "",
				bairro: user.bairro || "",
				localidade: user.localidade || "",
				uf: user.uf || "",
				numero: user.numero || "",
			});
		}
	}, [user]);

	if (!token) {
		return (
			<div className="text-red-600 text-center mt-4">
				Você precisa estar logado para editar seu perfil.
			</div>
		);
	}

	// Busca dados do endereço pelo CEP usando ViaCEP
	const handleCepBlur = async () => {
		const cep = form.cep.replace(/\D/g, "");
		if (cep.length !== 8) {
			setError("CEP deve ter 8 dígitos.");
			return;
		}
		try {
			const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
			const data = await res.json();
			if (data.erro) {
				setError("CEP não encontrado.");
				return;
			}
			setForm((prev) => ({
				...prev,
				logradouro: data.logradouro || "",
				bairro: data.bairro || "",
				localidade: data.localidade || "",
				uf: data.uf || "",
			}));
			setError("");
		} catch {
			setError("Erro ao buscar o CEP.");
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let {name, value} = e.target;
		// Limites de caracteres
		if (name === "cep") value = value.replace(/\D/g, "").slice(0, 8);
		if (name === "uf") value = value.slice(0, 2).toUpperCase();
		if (name === "cpf") value = value.replace(/\D/g, "").slice(0, 11);
		if (name === "phone") value = value.replace(/\D/g, "").slice(0, 15);
		if (name === "complemento") value = value.slice(0, 50);
		if (name === "logradouro") value = value.slice(0, 100);
		if (name === "bairro") value = value.slice(0, 50);
		if (name === "localidade") value = value.slice(0, 50);
		if (name === "numero") value = value.slice(0, 10);
		if (name === "name") value = value.slice(0, 100);
		if (name === "email") value = value.slice(0, 100);
		setForm({...form, [name]: value});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMsg("");
		setError("");
		try {
			const res = await fetch("http://localhost:3333/me", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(form),
			});

			if (!res.ok) throw new Error("Erro ao atualizar perfil");

			const updated = await res.json();
			setMsg("Perfil atualizado com sucesso!");
			setEditMode(false);
			if (setUser) setUser(updated);
			localStorage.setItem("user", JSON.stringify(updated)); // <-- Adicione esta linha
		} catch (err: any) {
			setError(err.message || "Erro ao atualizar perfil");
		}
		setLoading(false);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md space-y-6"
		>
			<h2 className="text-2xl font-semibold text-gray-800">Meu Perfil</h2>

			{msg && (
				<div className="bg-green-100 text-green-700 px-4 py-2 rounded">
					{msg}
				</div>
			)}
			{error && (
				<div className="bg-red-100 text-red-700 px-4 py-2 rounded">{error}</div>
			)}

			<fieldset className="space-y-4">
				<legend className="text-lg font-semibold text-gray-700 mb-2">
					Dados Pessoais
				</legend>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<Input
						label="Nome"
						name="name"
						value={form.name}
						onChange={handleChange}
						disabled={!editMode}
						maxLength={100}
					/>
					<Input
						label="Email"
						name="email"
						value={form.email}
						onChange={handleChange}
						disabled={!editMode}
						maxLength={100}
					/>
					<Input
						label="Telefone"
						name="phone"
						value={form.phone}
						onChange={handleChange}
						disabled={!editMode}
						maxLength={15}
					/>
					<Input
						label="CPF"
						name="cpf"
						value={form.cpf}
						onChange={handleChange}
						disabled={!editMode}
						maxLength={11}
					/>
				</div>
			</fieldset>

			<fieldset className="space-y-4">
				<legend className="text-lg font-semibold text-gray-700 mb-2">
					Endereço
				</legend>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<Input
						label="CEP"
						name="cep"
						value={form.cep}
						onChange={handleChange}
						onBlur={handleCepBlur}
						disabled={!editMode}
						maxLength={8}
					/>
					<Input
						label="Logradouro"
						name="logradouro"
						value={form.logradouro}
						onChange={handleChange}
						disabled={!editMode}
						maxLength={100}
					/>
					<Input
						label="Complemento"
						name="complemento"
						value={form.complemento}
						onChange={handleChange}
						disabled={!editMode}
						maxLength={50}
					/>
					<Input
						label="Bairro"
						name="bairro"
						value={form.bairro}
						onChange={handleChange}
						disabled={!editMode}
						maxLength={50}
					/>
					<Input
						label="Cidade"
						name="localidade"
						value={form.localidade}
						onChange={handleChange}
						disabled={!editMode}
						maxLength={50}
					/>
					<Input
						label="UF"
						name="uf"
						value={form.uf}
						onChange={handleChange}
						disabled={!editMode}
						maxLength={2}
					/>
					<Input
						label="Número"
						name="numero"
						value={form.numero}
						onChange={handleChange}
						disabled={!editMode}
						maxLength={10}
					/>
				</div>
			</fieldset>

			{!editMode ? (
				<button
					type="button"
					className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
					onClick={() => setEditMode(true)}
				>
					<Pencil size={16} /> Editar
				</button>
			) : (
				<div className="flex gap-3">
					<button
						type="submit"
						disabled={loading}
						className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
					>
						<Save size={16} /> {loading ? "Salvando..." : "Salvar"}
					</button>
					<button
						type="button"
						className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
						onClick={() => {
							setEditMode(false);
							if (user) {
								setForm({
									name: user.name || "",
									email: user.email || "",
									phone: user.phone || "",
									cpf: user.cpf || "",
									cep: user.cep || "",
									logradouro: user.logradouro || "",
									complemento: user.complemento || "",
									bairro: user.bairro || "",
									localidade: user.localidade || "",
									uf: user.uf || "",
									numero: user.numero || "",
								});
							}
						}}
					>
						<XCircle size={16} /> Cancelar
					</button>
				</div>
			)}
		</form>
	);
}

function Input({
	label,
	name,
	value,
	onChange,
	disabled,
	maxLength,
	onBlur,
}: any) {
	return (
		<div>
			<label className="block text-sm font-medium text-gray-700 mb-1">
				{label}
			</label>
			<input
				type="text"
				name={name}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				disabled={disabled}
				maxLength={maxLength}
				className={`w-full border rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
					disabled ? "bg-gray-100 cursor-not-allowed" : ""
				}`}
			/>
		</div>
	);
}
