import { useEffect, useState } from "react";
import { traduzirStatus } from "../UI/orderStatus";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { CancelOrderModal } from "./CancelOrderModal";
import { RateProviderModal } from "./RateProviderForm";

interface Order {
  id: string;
  service_id: string;
  service_name?: string;
  provider_id: string;
  provider_name?: string;
  status: string;
  price?: number;
  scheduled_date?: string;
  created_at?: string;
  address?: any;
  notes?: string;
  rating?: number;
  rating_comment?: string;
  cancelled_at?: string;  cancel_reason?: string;
}

export function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
    // Estados para o modal de detalhes
  const [orderDetailsModalOpen, setOrderDetailsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  
  // Estados para o modal de cancelamento
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string>('');
  const [cancelLoading, setCancelLoading] = useState(false);
  
  // Estados para o modal de avaliação
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [orderToRate, setOrderToRate] = useState<string>('');

  const token = localStorage.getItem("token");
  
  if (!token) {
    return <div className="text-red-600">Você precisa estar logado para ver suas ordens.</div>;
  }

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3333/clients/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao buscar ordens");
      const data = await res.json();      const mapped = data.map((order: any) => ({
        id: order.id,
        service_id: order.service_id,
        service_name: order.service_name,
        provider_id: order.provider_id,
        provider_name: order.provider_name,
        status: order.status,
        scheduled_date: order.scheduled_date,
        created_at: order.created_at,
        address: order.address
          ? typeof order.address === "string"
            ? JSON.parse(order.address)
            : order.address
          : undefined,
        notes: order.notes,
        rating: order.rating,
        rating_comment: order.rating_comment,
        cancelled_at: order.cancelled_at,
        cancel_reason: order.cancel_reason,
      }));
      
      // Debug: log para verificar se as ordens têm rating
      console.log("Ordens carregadas:", mapped.map(o => ({ 
        id: o.id, 
        status: o.status, 
        rating: o.rating,
        service_name: o.service_name 
      })));
      
      setOrders(mapped);
    } catch (err: any) {
      setError(err.message || "Erro ao buscar ordens");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const cancelOrder = async (id: string) => {
    setOrderToCancel(id);
    setCancelModalOpen(true);
  };

  const handleCancelConfirm = async (reason: string) => {
    setCancelLoading(true);
    try {
      const res = await fetch(`http://localhost:3333/clients/orders/${orderToCancel}/cancel`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cancel_reason: reason }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao cancelar ordem");
      }
      fetchOrders();
      setCancelModalOpen(false);
      setOrderToCancel('');
    } catch (error) {
      console.error("Erro ao cancelar ordem:", error);
    }
    setCancelLoading(false);
  };

  const handleCancelClose = () => {
    if (!cancelLoading) {
      setCancelModalOpen(false);
      setOrderToCancel('');
    }
  };

  const handleRateProvider = (orderId: string) => {
    setOrderToRate(orderId);
    setRateModalOpen(true);
  };

  const handleRateClose = () => {
    setRateModalOpen(false);
    setOrderToRate('');
  };
  const handleRated = () => {
    fetchOrders();
  };

  // Funções do modal de detalhes
  const handleViewOrderDetails = (id: string) => {
    setSelectedOrderId(id);
    setOrderDetailsModalOpen(true);
  };

  const handleCloseOrderDetails = () => {
    setOrderDetailsModalOpen(false);
    setSelectedOrderId('');
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="text-red-600">Erro ao mostrar suas ordens</div>;
  return (<div className="max-w-4xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-blue-800">Minhas Ordens</h2>
      {orders.length === 0 && (
        <div className="text-center py-8">
          <h1 className="text-lg font-semibold mb-2">Você não possui ordens de serviços.</h1>
          <p>Solicite um serviço para que sua ordem apareça aqui.</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4 bg-white shadow-sm flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-blue-700">{order.service_name ?? <span className="text-red-500">NÃO ENVIADO</span>}</span>              <span className={`text-xs font-semibold px-2 py-1 rounded ${
                order.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : order.status === 'completed' || order.status === 'done'
                  ? 'bg-green-100 text-green-800'
                  : order.status === 'in_progress'
                  ? 'bg-blue-100 text-blue-800'
                  : order.status === 'accepted'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {traduzirStatus(order.status)}
              </span>
            </div>
            <div className="text-sm text-gray-700">
              <b>Prestador:</b> {order.provider_name ?? <span className="text-red-500">NÃO ENVIADO</span>}
            </div>
            <div className="text-sm text-gray-700">
              <b>Data agendada:</b>{" "}
              {order.scheduled_date
                ? new Date(order.scheduled_date).toLocaleString("pt-BR")
                : order.created_at
                ? new Date(order.created_at).toLocaleString("pt-BR")
                : "-"}
            </div>
            <div className="text-sm text-gray-700">
              <b>Notas:</b> {order.notes || "Nenhuma"}
            </div>
            {order.cancelled_at && (
              <div className="text-sm text-red-600">
                Cancelada em: {new Date(order.cancelled_at).toLocaleString("pt-BR")}
              </div>
            )}            <div className="flex gap-2 mt-2">
              <button
                className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
                onClick={() => handleViewOrderDetails(order.id)}
              >
                Ver detalhes
              </button>              {order.status === "pending" && !order.cancelled_at && (
                <button
                  className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700"
                  onClick={() => cancelOrder(order.id)}
                >
                  Cancelar
                </button>
              )}
              {(order.status === "completed" || order.status === "done") && !order.rating && (
                <button
                  className="px-3 py-1 rounded bg-yellow-600 text-white text-sm hover:bg-yellow-700"
                  onClick={() => handleRateProvider(order.id)}
                >
                  Avaliar Prestador
                </button>
              )}
            </div>
          </div>        ))}
      </div>      {/* Modal de detalhes da ordem */}
      <OrderDetailsModal
        orderId={selectedOrderId}
        open={orderDetailsModalOpen}
        onClose={handleCloseOrderDetails}
        onRateProvider={handleRateProvider}
      />{/* Modal de cancelamento */}
      <CancelOrderModal
        isOpen={cancelModalOpen}
        onClose={handleCancelClose}
        onConfirm={handleCancelConfirm}
        loading={cancelLoading}
      />      {/* Modal de avaliação */}
      <RateProviderModal
        open={rateModalOpen}
        onClose={handleRateClose}
        orderId={orderToRate}
        onRated={handleRated}
      />
    </div>
  );
}