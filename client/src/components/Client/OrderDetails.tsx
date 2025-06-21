import { useEffect, useState } from "react";
import { RateProviderForm } from "./RateProviderForm";
import { traduzirStatus } from "../UI/orderStatus";
// Componente que mostra os detalhes completos de uma ordem selecionada pelo cliente.
// Busca os dados da ordem pelo ID (GET /clients/orders/:id).
// Exibe informações detalhadas, endereço, status, observações, cancelamento e avaliação.
// Permite avaliar o prestador após a conclusão do serviço.

interface Order {
  id: string;
  service_id: string;
  service_name?: string;
  provider_id: string;
  provider_name?: string;
  status: string;
  //price?: number;
  scheduled_date?: string;
  created_at?: string;
  address?: any;
  notes?: string;
  rating?: number;
  rating_comment?: string;
  cancelled_at?: string;
  cancel_reason?: string;
}

interface OrderDetailsProps {
  orderId: string;
  onBack: () => void;
}

export function OrderDetails({ orderId, onBack }: OrderDetailsProps) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <div className="text-red-600">Você precisa estar logado para ver os detalhes da ordem.</div>;
  }
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRate, setShowRate] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      const res = await fetch(`http://localhost:3333/clients/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setOrder(null);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setOrder({
        id: data.id,
        service_id: data.service_id,
        service_name: data.service_name,
        provider_id: data.provider_id,
        provider_name: data.provider_name,
        status: data.status,
        //price: data.price ?? 0,
        scheduled_date: data.scheduled_date,
        created_at: data.created_at,
        address: data.address
          ? typeof data.address === "string"
            ? JSON.parse(data.address)
            : data.address
          : undefined,
        notes: data.notes,
        rating: data.rating,
        rating_comment: data.rating_comment,
        cancelled_at: data.cancelled_at,
        cancel_reason: data.cancel_reason,
      });
      setLoading(false);
    };
    fetchOrder();
    // eslint-disable-next-line
  }, [orderId]);

  if (loading) return <div>Carregando...</div>;
  if (!order) return <div>Ordem não encontrada.</div>;

  return (
    <div>
      <button onClick={onBack} className="mb-4 text-blue-600 hover:underline">
        ← Voltar
      </button>
      <h2 className="text-xl font-bold mb-4">Detalhes da Ordem</h2>
      <div className="border rounded-lg p-4 mb-4">
        <div>
          <b>Serviço:</b> {order.service_name || order.service_id}
        </div>
        <div>
          <b>Prestador:</b> {order.provider_name || order.provider_id}
        </div>
        <div>
          <b>Status:</b> {traduzirStatus(order.status)}
        </div>
        <div>
          <b>Data agendada:</b>{" "}
          {order.scheduled_date
            ? new Date(order.scheduled_date).toLocaleString()
            : order.created_at
            ? new Date(order.created_at).toLocaleString()
            : "-"}
        </div>
        {/* <div>
          <b>Valor:</b> R$ {order.price}
        </div> */}
        {order.address && (
          <div className="mt-2">
            <b>Endereço:</b>
            <div>
              {order.address.logradouro}
              {order.address.numero ? `, ${order.address.numero}` : ""}
            </div>
            <div>
              {order.address.bairro} - {order.address.cidade}/{order.address.uf}
            </div>
            <div>CEP: {order.address.cep}</div>
            {order.address.complemento && <div>Compl.: {order.address.complemento}</div>}
          </div>
        )}
        {order.notes && (
          <div className="mt-2">
            <b>Observações:</b> {order.notes}
          </div>
        )}
        {order.cancelled_at && (
          <div className="mt-2 text-red-600">
            <b>Cancelada em:</b> {new Date(order.cancelled_at).toLocaleString()}
            {order.cancel_reason && (
              <div>
                <b>Motivo:</b> {order.cancel_reason}
              </div>
            )}
          </div>
        )}
        {order.status === "done" && !order.rating && (
          <button
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded"
            onClick={() => setShowRate(true)}
          >
            Avaliar Prestador
          </button>
        )}
        {order.rating && (
          <div className="mt-4">
            <b>Avaliação enviada:</b> {order.rating} estrelas
            {order.rating_comment && <div>Comentário: {order.rating_comment}</div>}
          </div>
        )}
      </div>
      {showRate && (
        <RateProviderForm
          orderId={order.id}
          onRated={() => {
            setShowRate(false);
            // Atualiza os dados da ordem após avaliação
            setLoading(true);
            fetch(`http://localhost:3333/clients/orders/${orderId}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
              .then((res) => res.json())
              .then((data) => {
                setOrder({
                  ...order,
                  rating: data.rating,
                  rating_comment: data.rating_comment,
                });
                setLoading(false);
              });
          }}
        />
      )}
    </div>
  );
}