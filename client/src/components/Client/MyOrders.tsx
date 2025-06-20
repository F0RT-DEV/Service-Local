import { useEffect, useState } from "react";

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
  cancelled_at?: string;
  cancel_reason?: string;
}

interface MyOrdersProps {
  onSelectOrder: (id: string) => void;
}

export function MyOrders({ onSelectOrder }: MyOrdersProps) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <div className="text-red-600">Você precisa estar logado para ver suas ordens.</div>;
  }
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3333/clients/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao buscar ordens");
      const data = await res.json();
      const mapped = data.map((order: any) => ({
        id: order.id,
        service_id: order.service_id,
        service_name: order.service_name,
        provider_id: order.provider_id,
        provider_name: order.provider_name,
        status: order.status,
        price: order.price ?? 0,
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
    const motivo = prompt("Informe o motivo do cancelamento (mínimo 10 caracteres):");
    if (!motivo || motivo.length < 10) {
      alert("Motivo muito curto.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:3333/clients/orders/${id}/cancel`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cancel_reason: motivo }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao cancelar ordem");
      }
      fetchOrders();
    } catch {
      alert("Erro ao cancelar ordem");
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Minhas Ordens</h2>
      {orders.length === 0 && <div>Nenhuma ordem encontrada.</div>}
      <ul className="space-y-4">
        {orders.map((order) => (
          <li key={order.id} className="border rounded-lg p-4 flex justify-between items-center">
            <div>
              <div className="font-medium">{order.service_name || order.service_id}</div>
              <div className="text-sm text-gray-500">Prestador: {order.provider_name || order.provider_id}</div>
              <div className="text-sm text-gray-500">Status: {order.status}</div>
              <div className="text-sm text-gray-500">
                Data agendada:{" "}
                {order.scheduled_date
                  ? new Date(order.scheduled_date).toLocaleString()
                  : order.created_at
                  ? new Date(order.created_at).toLocaleString()
                  : "-"}
              </div>
              <div className="text-sm text-gray-500">Valor: R$ {order.price}</div>
              {order.cancelled_at && (
                <div className="text-sm text-red-600">
                  Cancelada em: {new Date(order.cancelled_at).toLocaleString()}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button
                className="text-blue-600 hover:underline"
                onClick={() => onSelectOrder(order.id)}
              >
                Ver detalhes
              </button>
              {order.status === "pending" && !order.cancelled_at && (
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => cancelOrder(order.id)}
                >
                  Cancelar
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}