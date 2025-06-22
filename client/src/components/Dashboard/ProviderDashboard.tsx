import {useState, useEffect} from "react";
import {Star, Calendar, DollarSign, Users, Plus} from "lucide-react";
import {StatsCard} from "../UI/StatsCard";
import {ServiceCard} from "../Provider/ServiceCard";
import {ProfileAlert} from "../Provider/ProfileAlert";
import {Card, CardContent, CardHeader} from "../UI/Card";
import {ActionButton} from "../UI/ActionButton";
import {CreateService} from "../Provider/CreateService";
import {ServiceDetailsModal} from "../Provider/ServiceDetailsModal";
import {ServiceEditModal} from "../Provider/ServiceEditModal";


export function ProviderDashboard({ setCurrentView }: { setCurrentView: (view: string) => void }) {
    const [showCreateService, setShowCreateService] = useState(false);
    const [myServices, setMyServices] = useState<any[]>([]);
	const [loadingServices, setLoadingServices] = useState(true);
    const [providerStatus, setProviderStatus] = useState<string | null>(null);
    const [pendingCount, setPendingCount] = useState(0);


    // Estados para modais
    const [selectedService, setSelectedService] = useState<any>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [averageRating, setAverageRating] = useState<string>("0.0");

    // Ordens pendentes
    const [pendingOrders, setPendingOrders] = useState<any[]>([]);

    const [totalOrders, setTotalOrders] = useState(0);
    const [totalServices, setTotalServices] = useState(0);

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

    // Funções para aceitar e recusar ordens
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

    // Carrega ordens pendentes
    useEffect(() => {
        async function fetchPendingOrders() {
            try {
                const res = await fetch("http://localhost:3333/orders/pending", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await res.json();
                setPendingOrders(data);
            } catch {
                setPendingOrders([]);
            }
        }
        fetchPendingOrders();
    }, []);

    // Carrega contador de ordens pendentes
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

    // Busca avaliação média do provider
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

    // Carrega serviços do banco ao montar
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

    // Carrega status do provider ao montar
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

    // Atualiza serviço editado
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
            const updated = await res.json();
            setMyServices((prev) =>
                prev.map((s) => (s.id === updated.id ? updated : s))
            );
        } catch (err) {
            alert("Erro ao atualizar serviço!");
        }
    };

    const handleCreateService = () => {
        if (providerStatus === "pending") {
            alert("Seu perfil está aguardando aprovação. Você não pode criar serviços ainda.");
            return;
        }
        setShowCreateService(true);
    };

    const handleBackToDashboard = () => {
        setShowCreateService(false);
    };

    // Adiciona novo serviço ao banco e à lista local
    const handleServiceCreated = async (serviceData: any) => {
        setShowCreateService(false);
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
        } catch (err) {
            alert("Erro ao cadastrar serviço!");
        }
    };

    if (showCreateService && providerStatus !== "pending") {
        return (
            <CreateService
                onBack={handleBackToDashboard}
                onCreate={handleServiceCreated}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Dashboard do Prestador
                </h1>
                <p className="text-gray-600">
                    Gerencie seus serviços e ordens recebidas.
                </p>
            </div>

            {/* Só mostra o alerta se o status for "pending" */}
            {providerStatus === "pending" && (
                <ProfileAlert onCompleteProfile={() => setCurrentView("profile")} />
            )}

            {/* Stats Cards */}
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
                {/* Pending Orders */}
                <Card>
                    <CardHeader className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Ordens Pendentes
                        </h2>
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {pendingOrders.length} nova(s)
                        </span>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {pendingOrders.length === 0 && (
                                <div className="text-gray-500 text-sm">
                                    Nenhuma ordem pendente.
                                </div>
                            )}
                            {pendingOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="border rounded-lg p-4 bg-white shadow-sm flex flex-col gap-2"
                                >
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-blue-700">
                                            {order.service_name}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(order.scheduled_date).toLocaleString("pt-BR")}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-700">
                                        Cliente:{" "}
                                        <span className="font-medium">{order.client_name}</span>
                                    </div>
                                    <div className="text-sm text-gray-700">
                                        Notas:{" "}
                                        <span className="font-normal">
                                            {order.notes || "Nenhuma"}
                                        </span>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700"
                                            onClick={() => handleAcceptOrder(order.id)}
                                        >
                                            Aceitar
                                        </button>
                                        <button
                                            className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700"
                                            onClick={() => handleRejectOrder(order.id)}
                                        >
                                            Recusar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                {/* My Services */}
                <Card>
                    <CardHeader className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Meus Serviços
                        </h2>
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
                                <div>Carregando...</div>
                            ) : (
                                myServices.map((service) => (
                                    <ServiceCard
                                        key={service.id}
                                        service={service}
                                        onEdit={() => {
                                            setSelectedService(service);
                                            setShowEdit(true);
                                        }}
                                        onViewDetails={() => {
                                            setSelectedService(service);
                                            setShowDetails(true);
                                        }}
                                    />
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modais */}
            <ServiceDetailsModal
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
        </div>
    );
}