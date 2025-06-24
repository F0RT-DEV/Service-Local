import {useEffect, useState} from "react";
import {FileText} from "lucide-react";
import {ActionButton} from "../UI/ActionButton";
import {SpecialtiesSection} from "./SpecialtiesSection";
import {ProfileSidebar} from "./ProfileSidebar";

interface Category {
	id: string;
	name: string;
}

export function ProviderProfile() {
	function formatCNPJ(value: string) {
		// Aplica a máscara: 00.000.000/0000-00
		return value
			.replace(/\D/g, "")
			.replace(/^(\d{2})(\d)/, "$1.$2")
			.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
			.replace(/\.(\d{3})(\d)/, ".$1/$2")
			.replace(/(\d{4})(\d)/, "$1-$2")
			.slice(0, 18);
	}

	const token = localStorage.getItem("token");
	const [profileData, setProfileData] = useState({
		name: "",
		email: "",
		phone: "",
		address: "",
		bio: "",
		cnpj: "",
	});
	const [categories, setCategories] = useState<Category[]>([]);
	const [specialties, setSpecialties] = useState<string[]>([]); // IDs das categorias
	const [cpf, setCpf] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const [msg, setMsg] = useState("");
	const [error, setError] = useState("");
	const [providerStatus, setProviderStatus] = useState<string>("pending"); // novo estado

	// Buscar categorias do backend
	useEffect(() => {
		fetch("http://localhost:3333/categories")
			.then((res) => res.json())
			.then(setCategories)
			.catch(() => setCategories([]));
	}, []);

	// Buscar dados do provider
	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const res = await fetch("http://localhost:3333/me", {
					headers: {Authorization: `Bearer ${token}`},
				});
				if (!res.ok) throw new Error("Erro ao buscar perfil");
				const data = await res.json();
				if (data && data.user && data.provider) {
					setProfileData({
						name: data.user.name || "",
						email: data.user.email || "",
						phone: data.user.phone || "",
						address: [
							data.user.logradouro,
							data.user.numero,
							data.user.bairro,
							data.user.localidade,
							data.user.uf,
						]
							.filter(Boolean)
							.join(", "),
						bio: data.provider.bio || "",
						cnpj: data.provider.cnpj || "",
					});
					setCpf(data.user.cpf || "");
					if (data.provider.categories) {
						setSpecialties(data.provider.categories.map((c: any) => c.id));
					}
					setProviderStatus(data.provider.status || "pending");
				}
			} catch (err: any) {
				setError(err.message || "Erro ao buscar perfil");
			}
		};
		if (token) fetchProfile();
	}, [token]);

	const handleSave = async () => {
		setMsg("");
		setError("");
		try {
			// Atualizar dados do usuário (nome, email, telefone)
			const resUser = await fetch("http://localhost:3333/me", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					name: profileData.name,
					email: profileData.email,
					phone: profileData.phone,
				}),
			});
			if (!resUser.ok) throw new Error("Erro ao atualizar dados básicos");

			// Atualizar dados do provider (bio, cnpj, categorias)
			const resProvider = await fetch("http://localhost:3333/provider", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					bio: profileData.bio,
					cnpj: profileData.cnpj,
					categories: specialties,
				}),
			});
			if (!resProvider.ok)
				throw new Error("Erro ao atualizar dados do prestador");

			setMsg("Perfil atualizado com sucesso!");
			setIsEditing(false);
		} catch (err: any) {
			setError(err.message || "Erro ao atualizar perfil");
		}
	};

	// Para exibir nomes das categorias selecionadas
	const specialtyOptions = categories.map((cat) => ({
		id: cat.id,
		name: cat.name,
	}));
	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
					<p className="text-gray-600">
						Complete seu perfil para receber aprovação
					</p>
				</div>
				{!isEditing ? (
					<ActionButton onClick={() => setIsEditing(true)}>
						Editar Perfil
					</ActionButton>
				) : (
					<div className="flex space-x-2">
						<ActionButton variant="success" onClick={handleSave}>
							Salvar
						</ActionButton>
						<ActionButton
							variant="secondary"
							onClick={() => setIsEditing(false)}
						>
							Cancelar
						</ActionButton>
					</div>
				)}
			</div>

			{msg && <div className="text-green-600">{msg}</div>}
			{error && <div className="text-red-600">{error}</div>}

			{/* Só mostra o alerta se o status for "pending" */}
			{providerStatus === "pending" && (
				<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
					<div className="flex items-center">
						<div className="flex-shrink-0">
							<div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
								<FileText className="h-4 w-4 text-white" />
							</div>
						</div>
						<div className="ml-3">
							<h3 className="text-sm font-medium text-yellow-800">
								Status: Aguardando Aprovação
							</h3>
							<p className="text-sm text-yellow-700">
								Complete todas as informações para acelerar o processo de
								aprovação.
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Se aprovado, mostra status aprovado */}
			{providerStatus === "approved" && (
				<div className="bg-green-50 border border-green-200 rounded-lg p-4">
					<div className="flex items-center">
						<div className="flex-shrink-0">
							<div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
								<FileText className="h-4 w-4 text-white" />
							</div>
						</div>
						<div className="ml-3">
							<h3 className="text-sm font-medium text-green-800">
								Status: Aprovado
							</h3>
							<p className="text-sm text-green-700">
								Seu perfil foi aprovado! Agora você pode receber ordens
								normalmente.
							</p>
						</div>
					</div>
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Informações básicas (agora editáveis) */}
				<div className="lg:col-span-2 space-y-6">
					<div className="bg-white rounded-lg shadow p-4">
						<h2 className="text-lg font-semibold mb-2">Informações Básicas</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium">Nome</label>
								<input
									className="w-full border rounded px-3 py-2"
									value={profileData.name}
									onChange={(e) =>
										setProfileData({...profileData, name: e.target.value})
									}
									disabled={!isEditing ? true : false}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium">Email</label>
								<input
									className="w-full border rounded px-3 py-2"
									value={profileData.email}
									onChange={(e) =>
										setProfileData({...profileData, email: e.target.value})
									}
									disabled={!isEditing ? true : false}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium">Telefone</label>
								<input
									className="w-full border rounded px-3 py-2"
									value={profileData.phone}
									onChange={(e) =>
										setProfileData({
											...profileData,
											phone: e.target.value.replace(/\D/g, "").slice(0, 15), // Apenas números, máximo 15 dígitos
										})
									}
									disabled={!isEditing ? true : false}
									maxLength={11}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium">Endereço</label>
								<input
									className="w-full border rounded px-3 py-2"
									value={profileData.address}
									disabled
								/>
							</div>
							<div>
								<label className="block text-sm font-medium">CPF</label>
								<input
									className="w-full border rounded px-3 py-2"
									value={cpf}
									disabled
								/>
							</div>
						</div>
					</div>

					{/* Campos editáveis */}
					<div className="bg-white rounded-lg shadow p-4 space-y-4">
						<div>
							<label className="block font-medium mb-1">Bio</label>
							<textarea
								className="w-full border rounded px-3 py-2 resize-none"
								value={profileData.bio}
								onChange={(e) =>
									setProfileData({...profileData, bio: e.target.value})
								}
								disabled={!isEditing}
								rows={3}
								maxLength={300}
								placeholder="Fale um pouco sobre você e seus diferenciais"
							/>
						</div>
						<div>
							<label className="block font-medium mb-1">CNPJ</label>
							<input
								className="w-full border rounded px-3 py-2"
								value={formatCNPJ(profileData.cnpj)}
								onChange={(e) => {
									// Remove tudo que não for número e limita a 14 dígitos
									const raw = e.target.value.replace(/\D/g, "").slice(0, 14);
									setProfileData({
										...profileData,
										cnpj: raw,
									});
								}}
								disabled={!isEditing}
								placeholder="00.000.000/0000-00"
								maxLength={18} // 18 contando pontos, barras e traço
							/>
						</div>
						<div>
							<SpecialtiesSection
								specialties={specialties}
								setSpecialties={setSpecialties}
								isEditing={isEditing}
								specialtyOptions={specialtyOptions}
							/>
						</div>
					</div>
				</div>

				{/* Sidebar */}
				<ProfileSidebar isEditing={isEditing} />
			</div>
		</div>
	);
}
