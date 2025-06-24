import {useState, useEffect} from "react";
import {Star, Calendar, DollarSign, Users, Plus} from "lucide-react";
import {StatsCard} from "../UI/StatsCard";
import {ServiceCard} from "../Provider/ServiceCard";
import {ProfileAlert} from "../Provider/ProfileAlert";
import {Card, CardContent, CardHeader} from "../UI/Card";
import {ActionButton} from "../UI/ActionButton";
import {CreateServiceModal} from "../Provider/CreateServiceModal";
import {ServiceDetailsModal} from "../Provider/ServiceDetailsModal";
import {ServiceEditModal} from "../Provider/ServiceEditModal";
import {usePromptAlerts} from "../UI/AlertContainer";

export function ProviderDashboard({
	setCurrentView,
}: {
	setCurrentView: (view: string) => void;
}) {
	const [showCreateService, setShowCreateService] = useState(false);
	const [myServices, setMyServices] = useState<any[]>([]);
	const [loadingServices, setLoadingServices] = useState(true);
	const [providerStatus, setProviderStatus] = useState<string | null>(null);
	const [pendingCount, setPendingCount] = useState(0);
	const [selectedService, setSelectedService] = useState<any>(null);
	const [showDetails, setShowDetails] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [averageRating, setAverageRating] = useState<string>("0.0");
	const [pendingOrders, setPendingOrders] = useState<any[]>([]);
	const [totalOrders, setTotalOrders] = useState(0);
	const [totalServices, setTotalServices] = useState(0);
	const alerts = usePromptAlerts();

	useEffect(() => {
		async function fetchTotals() {
			try {
				const resOrders = await fetch("http://localhost:3333/orders/total", {
					headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
				});
				const dataOrders = await resOrders.json();
				setTotalOrders(Number(dataOrders.total));

				const resServices = await fetch(
					"http://localhost:3333/services/total",
					{
						headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
					}
				);
				const dataServices = await resServices.json();
				setTotalServices(Number(dataServices.total));
			} catch {
				setTotalOrders(0);
				setTotalServices(0);
			}
		}
		fetchTotals();
	}, []);

	const handleAcceptOrder = async (orderId: string) => {
		try {
			await fetch(`http://localhost:3333/providers/orders/${orderId}/accept`, {
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			setPendingOrders((prev) => prev.filter((o) => o.id !== orderId));
			setPendingCount((prev) => prev - 1);
		} catch {
			alert("Erro ao aceitar ordem!");
		}
	};

	const handleRejectOrder = async (orderId: string) => {
		try {
			await fetch(`http://localhost:3333/providers/orders/${orderId}/reject`, {
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			setPendingOrders((prev) => prev.filter((o) => o.id !== orderId));
			setPendingCount((prev) => prev - 1);
		} catch {
			alert("Erro ao recusar ordem!");
		}
	};

	useEffect(() => {
		async function fetchPendingOrders() {
			try {
				const res = await fetch("http://localhost:3333/orders/pending", {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				});
				const data = await res.json();
				setPendingOrders(Array.isArray(data) ? data : []);
			} catch {
				setPendingOrders([]);
			}
		}
		fetchPendingOrders();
	}, []);

	useEffect(() => {
		async function fetchPendingCount() {
			try {
				const res = await fetch("http://localhost:3333/orders/pending/count", {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				});
				const data = await res.json();
				setPendingCount(Number(data.total));
			} catch {
				setPendingCount(0);
			}
		}
		fetchPendingCount();
	}, []);

	useEffect(() => {
		async function fetchAverageRating() {
			try {
				const res = await fetch(
					"http://localhost:3333/providers/ratings/summary",
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					}
				);
				const data = await res.json();
				setAverageRating(Number(data.average_rating).toFixed(2));
			} catch {
				setAverageRating("0.0");
			}
		}
		fetchAverageRating();
	}, []);

	useEffect(() => {
		fetch("http://localhost:3333/services/me", {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setMyServices(data);
				setLoadingServices(false);
			});
	}, []);

	useEffect(() => {
		async function fetchProviderStatus() {
			try {
				const res = await fetch("http://localhost:3333/me", {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				});
				const data = await res.json();
				setProviderStatus(data.provider?.status);
			} catch {
				setProviderStatus(null);
			}
		}
		fetchProviderStatus();
	}, []);

	const handleUpdateService = async (updatedService: any) => {
		try {
			const res = await fetch(
				`http://localhost:3333/services/${updatedService.id}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
					body: JSON.stringify(updatedService),
				}
			);
			if (!res.ok) throw new Error("Erro ao atualizar serviço");
			const updated = await fetch(
				`http://localhost:3333/services/${updatedService.id}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			).then((r) => r.json());
			setMyServices((prev) =>
				prev.map((s) => (s.id === updated.id ? updated : s))
			);
			setSelectedService(updated);
			// Mostra o popup de sucesso
			alerts.success("Serviço atualizado com sucesso!");
		} catch (err) {
			alerts.error("Erro ao atualizar serviço!");
		}
	};
	const handleCreateService = () => {
		if (providerStatus === "pending") {
			alerts.warning(
				"Seu perfil está aguardando aprovação. Você não pode criar serviços ainda.",
				"Perfil Pendente"
			);
			return;
		}
		setShowCreateService(true);
	};

	const handleServiceCreated = async (serviceData: any) => {
		try {
			const res = await fetch("http://localhost:3333/services", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify(serviceData),
			});
			if (!res.ok) throw new Error("Erro ao criar serviço");
			const created = await res.json();
			setMyServices((prev) => [created, ...prev]);
			// O modal já vai mostrar o alert de sucesso
		} catch (err) {
			alerts.error("Erro ao cadastrar serviço!", "Falha na operação");
		}
	};

	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-2xl font-bold text-gray-900">
					Dashboard do Prestador
				</h1>
				<p className="text-gray-600">
					Gerencie seus serviços e ordens recebidas.
				</p>
			</div>

			{providerStatus === "pending" && (
				<ProfileAlert onCompleteProfile={() => setCurrentView("profile")} />
			)}

			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<StatsCard
					icon={Calendar}
					iconColor="text-blue-600"
					title="Ordens Pendentes"
					value={pendingCount.toString()}
				/>
				<StatsCard
					icon={Users}
					iconColor="text-green-600"
					title="Total de Ordens Recebidas"
					value={totalOrders.toString()}
				/>
				<StatsCard
					icon={DollarSign}
					iconColor="text-orange-600"
					title="Total de Serviços"
					value={totalServices.toString()}
				/>
				<StatsCard
					icon={Star}
					iconColor="text-yellow-600"
					title="Avaliação Média"
					value={averageRating}
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card>
					<CardHeader className="flex justify-between items-center border-b pb-2 bg-gradient-to-r from-red-50 to-white rounded-t-lg">
						<div className="flex items-center gap-2">
							<Calendar className="text-blue-500" size={22} />
							<h2 className="text-lg font-bold text-gray-900 tracking-tight">
								Ordens Pendentes
							</h2>
						</div>
						<span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full shadow">
							{pendingOrders.length} nova(s)
						</span>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{pendingOrders.length === 0 ? (
								<div className="text-gray-400 text-center py-8 flex flex-col items-center">
									<Users className="mb-2 text-gray-300" size={32} />
									Nenhuma ordem pendente.
								</div>
							) : (
								pendingOrders.map((order) => (
									<div
										key={order.id}
										className="border border-red-100 rounded-xl p-4 bg-gradient-to-br from-white to-red-50 shadow flex flex-col gap-2 transition hover:shadow-lg"
									>
										<div className="flex justify-between items-center">
											<span className="font-semibold text-blue-700 text-base flex items-center gap-1">
												<Calendar size={16} className="text-blue-400" />
												{order.service_name}
											</span>
											<span className="text-xs text-gray-500 font-mono">
												{new Date(order.scheduled_date).toLocaleString("pt-BR")}
											</span>
										</div>
										<div className="text-sm text-gray-700">
											<span className="font-semibold">Cliente:</span>{" "}
											<span className="font-medium">{order.client_name}</span>
										</div>
										<div className="text-sm text-gray-700">
											<span className="font-semibold">Notas:</span>{" "}
											<span className="font-normal">
												{order.notes || "Nenhuma"}
											</span>
										</div>
										<div className="flex gap-2 mt-2">
											<button
												className="flex-1 px-3 py-1 rounded bg-green-600 text-white text-sm font-semibold shadow hover:bg-green-700 transition"
												onClick={() => handleAcceptOrder(order.id)}
											>
												Aceitar
											</button>
											<button
												className="flex-1 px-3 py-1 rounded bg-red-600 text-white text-sm font-semibold shadow hover:bg-red-700 transition"
												onClick={() => handleRejectOrder(order.id)}
											>
												Recusar
											</button>
										</div>
									</div>
								))
							)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex justify-between items-center border-b pb-2 bg-gradient-to-r from-orange-50 to-white rounded-t-lg">
						<div className="flex items-center gap-2">
							<DollarSign className="text-orange-500" size={22} />
							<h2 className="text-lg font-bold text-gray-900 tracking-tight">
								Meus Serviços
							</h2>
						</div>
						<ActionButton
							icon={Plus}
							onClick={handleCreateService}
							disabled={providerStatus === "pending"}
						>
							Novo Serviço
						</ActionButton>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{loadingServices ? (
								<div className="text-gray-400 text-center py-8 flex flex-col items-center">
									<DollarSign className="mb-2 text-gray-300" size={32} />
									Carregando...
								</div>
							) : myServices.length === 0 ? (
								<div className="text-gray-400 text-center py-8 flex flex-col items-center">
									<Plus className="mb-2 text-gray-300" size={32} />
									Nenhum serviço cadastrado.
								</div>
							) : (
								myServices.map((service) => (
									<ServiceCard
										key={service.id}
										service={service}
										onEdit={() => {
											setSelectedService(service);
											setShowEdit(true);
										}}
										onViewDetails={async (id: string) => {
											const res = await fetch(
												`http://localhost:3333/services/${id}`,
												{
													headers: {
														Authorization: `Bearer ${localStorage.getItem(
															"token"
														)}`,
													},
												}
											);
											const data = await res.json();
											setSelectedService(data);
											setShowDetails(true);
										}}
									/>
								))
							)}
						</div>
					</CardContent>
				</Card>
			</div>			<ServiceDetailsModal
				open={showDetails}
				service={selectedService}
				onClose={() => setShowDetails(false)}
			/>
			<ServiceEditModal
				open={showEdit}
				service={selectedService}
				onClose={() => setShowEdit(false)}
				onSave={handleUpdateService}
			/>
			<CreateServiceModal
				open={showCreateService && providerStatus !== "pending"}
				onClose={() => setShowCreateService(false)}
				onCreate={handleServiceCreated}
			/>
		</div>
	);
}
