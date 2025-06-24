import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

interface Order {
  id: string;
  client_name: string;
  service_name: string;
  status: string;
  scheduled_date: string;
  created_at: string;
  notes: string;
  address: string;
  phone?: string;
}

export function ProviderOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
     
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
  };  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-blue-800">Ordens Recebidas</h2>
      {loading && <div>Carregando...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        orders.length === 0 ? (
          <div>Nenhuma ordem recebida.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-blue-100 rounded-xl p-4 bg-gradient-to-br from-white to-blue-50 shadow flex flex-col gap-2 transition hover:shadow-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-blue-700">{order.service_name}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full
                    ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800'
                      : order.status === 'completed' ? 'bg-green-100 text-green-800'
                      : order.status === 'in_progress' ? 'bg-blue-100 text-blue-800'
                      : order.status === 'accepted' ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-800'}`}>
                    {order.status === 'pending' ? 'Pendente'
                      : order.status === 'completed' ? 'Concluído'
                      : order.status === 'in_progress' ? 'Em andamento'
                      : order.status === 'accepted' ? 'Aceito'
                      : order.status === 'done' ? 'Finalizado'
                      : order.status}
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
                  className="mt-2 px-4 py-2 rounded bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700 self-end transition"
                  onClick={() => { setSelectedOrder(order); setShowDetails(true); }}
                >
                  Ver detalhes
                </button>
              </div>
            ))}
          </div>
        )
      )}      {showDetails && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto relative animate-fade-in border border-blue-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-gradient-to-r from-blue-100 to-white rounded-t-2xl border-b">
              <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                <FileText className="text-blue-500 flex-shrink-0" size={22} />
                <h3 className="text-lg sm:text-xl font-bold text-blue-800 truncate">{selectedOrder.service_name}</h3>
              </div>
              <button
                className="text-gray-400 hover:text-gray-700 transition flex-shrink-0"
                onClick={() => setShowDetails(false)}
              >
                ✕
              </button>            </div>
            <div className="px-4 sm:px-6 py-5">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-bold px-2 py-1 rounded-full
                  ${selectedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800'
                    : selectedOrder.status === 'completed' ? 'bg-green-100 text-green-800'
                    : selectedOrder.status === 'in_progress' ? 'bg-blue-100 text-blue-800'
                    : selectedOrder.status === 'accepted' ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-800'}`}>
                  {selectedOrder.status === 'pending' ? 'Pendente'
                    : selectedOrder.status === 'completed' ? 'Concluído'
                    : selectedOrder.status === 'in_progress' ? 'Em andamento'
                    : selectedOrder.status === 'accepted' ? 'Aceito'
                    : selectedOrder.status === 'done' ? 'Finalizado'
                    : selectedOrder.status}
                </span>
              </div>              <div className="mb-2"><b>Cliente:</b> <span className="text-gray-800">{selectedOrder.client_name}</span></div>
              {selectedOrder.phone && (
                <div className="mb-2"><b>Telefone:</b> <span className="text-gray-800">{selectedOrder.phone}</span></div>
              )}
              <div className="mb-2"><b>Data agendada:</b> <span className="text-gray-800">{new Date(selectedOrder.scheduled_date).toLocaleString("pt-BR")}</span></div>
              <div className="mb-2"><b>Notas:</b> <span className="text-gray-800">{selectedOrder.notes || "Nenhuma"}</span></div>
              <div className="mb-2"><b>Endereço:</b> {renderAddress(selectedOrder.address)}</div>
              <div className="flex gap-2 mt-6">
                {selectedOrder.status === "pending" && (
                  <>
                    <button
                      className="px-4 py-2 rounded bg-green-600 text-white text-sm font-semibold shadow hover:bg-green-700 transition"
                      onClick={() => handleAccept(selectedOrder.id)}
                    >
                      Aceitar
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-red-600 text-white text-sm font-semibold shadow hover:bg-red-700 transition"
                      onClick={() => handleReject(selectedOrder.id)}
                    >
                      Recusar
                    </button>
                  </>
                )}
                {selectedOrder.status === "accepted" && (
                  <button
                    className="px-4 py-2 rounded bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700 transition"
                    onClick={() => handleProgress(selectedOrder.id)}
                  >
                    Colocar em andamento
                  </button>
                )}
                {selectedOrder.status === "in_progress" && (
                  <button
                    className="px-4 py-2 rounded bg-green-700 text-white text-sm font-semibold shadow hover:bg-green-800 transition"
                    onClick={() => handleComplete(selectedOrder.id)}
                  >
                    Concluir serviço
                  </button>
                )}
                <button
                  className="px-4 py-2 rounded bg-gray-200 text-gray-800 text-sm font-semibold hover:bg-gray-300 transition"
                  onClick={() => setShowDetails(false)}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}