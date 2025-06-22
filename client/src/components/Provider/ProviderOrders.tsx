import { useEffect, useState } from "react";

interface Order {
  id: string;
  client_name: string;
  service_name: string;
  status: string;
  scheduled_date: string;
  created_at: string;
  notes: string;
  address: string;
}

export function ProviderOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Você precisa estar logado.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("http://localhost:3333/providers/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao buscar ordens");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Erro ao buscar ordens");
    }
    setLoading(false);
  };

  const handleAccept = async (orderId: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3333/providers/orders/${orderId}/accept`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao aceitar ordem");
      fetchOrders();
      setShowDetails(false);
    } catch (err: any) {
      alert(err.message || "Erro ao aceitar ordem");
    }
  };

  const handleReject = async (orderId: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3333/providers/orders/${orderId}/reject`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao recusar ordem");
      fetchOrders();
      setShowDetails(false);
    } catch (err: any) {
      alert(err.message || "Erro ao recusar ordem");
    }
  };

  const handleProgress = async (orderId: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3333/providers/orders/${orderId}/progress`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao colocar ordem em andamento");
      fetchOrders();
      setShowDetails(false);
    } catch (err: any) {
      alert(err.message || "Erro ao colocar ordem em andamento");
    }
  };

  const handleComplete = async (orderId: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3333/providers/orders/${orderId}/complete`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao concluir ordem");
      fetchOrders();
      setShowDetails(false);
    } catch (err: any) {
      alert(err.message || "Erro ao concluir ordem");
    }
  };

  // Para exibir endereço formatado
  const renderAddress = (address: string) => {
    try {
      const addr = JSON.parse(address);
      return (
        <div className="text-sm text-gray-700">
          <div><b>CEP:</b> {addr.cep}</div>
          <div><b>Logradouro:</b> {addr.logradouro}</div>
          {addr.complemento && <div><b>Complemento:</b> {addr.complemento}</div>}
          <div><b>Bairro:</b> {addr.bairro}</div>
          <div><b>Cidade:</b> {addr.cidade} - {addr.uf}</div>
        </div>
      );
    } catch {
      return <span>-</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-blue-800">Ordens Recebidas</h2>
      {loading && <div>Carregando...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        orders.length === 0 ? (
          <div>Nenhuma ordem recebida.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 bg-white shadow-sm flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-blue-700">{order.service_name}</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : order.status === 'completed' ? 'bg-green-100 text-green-800' : order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : order.status === 'accepted' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-sm text-gray-700">
                  <b>Cliente:</b> {order.client_name}
                </div>
                <div className="text-sm text-gray-700">
                  <b>Data agendada:</b> {new Date(order.scheduled_date).toLocaleString("pt-BR")}
                </div>
                <div className="text-sm text-gray-700">
                  <b>Notas:</b> {order.notes || "Nenhuma"}
                </div>
                <button
                  className="mt-2 px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 self-end"
                  onClick={() => { setSelectedOrder(order); setShowDetails(true); }}
                >
                  Ver detalhes
                </button>
              </div>
            ))}
          </div>
        )
      )}

      {/* Modal de detalhes */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={() => setShowDetails(false)}
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-2 text-blue-700">{selectedOrder.service_name}</h3>
            <div className="mb-2"><b>Status:</b> {selectedOrder.status}</div>
            <div className="mb-2"><b>Cliente:</b> {selectedOrder.client_name}</div>
            <div className="mb-2"><b>Data agendada:</b> {new Date(selectedOrder.scheduled_date).toLocaleString("pt-BR")}</div>
            <div className="mb-2"><b>Notas:</b> {selectedOrder.notes || "Nenhuma"}</div>
            <div className="mb-2"><b>Endereço:</b> {renderAddress(selectedOrder.address)}</div>
            <div className="flex gap-2 mt-4">
              {selectedOrder.status === "pending" && (
                <>
                  <button
                    className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700"
                    onClick={() => handleAccept(selectedOrder.id)}
                  >
                    Aceitar
                  </button>
                  <button
                    className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700"
                    onClick={() => handleReject(selectedOrder.id)}
                  >
                    Recusar
                  </button>
                </>
              )}
              {selectedOrder.status === "accepted" && (
                <button
                  className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
                  onClick={() => handleProgress(selectedOrder.id)}
                >
                  Colocar em andamento
                </button>
              )}
              {selectedOrder.status === "in_progress" && (
                <button
                  className="px-3 py-1 rounded bg-green-700 text-white text-sm hover:bg-green-800"
                  onClick={() => handleComplete(selectedOrder.id)}
                >
                  Concluir serviço
                </button>
              )}
              <button
                className="px-3 py-1 rounded bg-gray-300 text-gray-800 text-sm hover:bg-gray-400"
                onClick={() => setShowDetails(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}