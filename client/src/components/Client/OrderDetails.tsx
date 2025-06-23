import { useEffect, useState } from "react";

import { traduzirStatus } from "../UI/orderStatus";
import { Card } from "../UI/Card";
import { RateProviderModal } from "./RateProviderForm";
interface Order {
  id: string;
  service_id: string;
  service_name?: string;
  provider_id: string;
  provider_name?: string;
  status: string;
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

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-blue-100 text-blue-800',
  rejected: 'bg-red-100 text-red-800',
  in_progress: 'bg-purple-100 text-purple-800',
  done: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800'
};

export function OrderDetails({ orderId, onBack }: OrderDetailsProps) {
  const token = localStorage.getItem("token");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRate, setShowRate] = useState(false);
const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3333/clients/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Erro ao carregar ordem');
        const data = await res.json();
        setOrder({
          id: data.id,
          service_id: data.service_id,
          service_name: data.service_name,
          provider_id: data.provider_id,
          provider_name: data.provider_name,
          status: data.status,
          scheduled_date: data.scheduled_date,
          created_at: data.created_at,
          address: data.address ? (typeof data.address === "string" ? JSON.parse(data.address) : data.address) : undefined,
          notes: data.notes,
          rating: data.rating,
          rating_comment: data.rating_comment,
          cancelled_at: data.cancelled_at,
          cancel_reason: data.cancel_reason,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, token]);

  if (!token) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
        Você precisa estar logado para ver os detalhes da ordem.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
        Ordem não encontrada.
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center mt-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <button 
        onClick={onBack} 
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Voltar
      </button>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Detalhes da Ordem</h2>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
          {traduzirStatus(order.status)}
        </span>
      </div>

      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Serviço</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">
                {order.service_name || order.service_id}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Prestador</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">
                {order.provider_name || order.provider_id}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Data Agendada</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">
                {order.scheduled_date
                  ? new Date(order.scheduled_date).toLocaleString('pt-BR')
                  : order.created_at
                  ? new Date(order.created_at).toLocaleString('pt-BR')
                  : "-"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Endereço</h3>
              {order.address ? (
                <div className="mt-1 text-gray-900">
                  <p className="font-medium">{order.address.logradouro}{order.address.numero && `, ${order.address.numero}`}</p>
                  <p>{order.address.bairro} - {order.address.cidade}/{order.address.uf}</p>
                  <p>CEP: {order.address.cep}</p>
                  {order.address.complemento && <p>Complemento: {order.address.complemento}</p>}
                </div>
              ) : (
                <p className="mt-1 text-gray-500">Nenhum endereço cadastrado</p>
              )}
            </div>

            {order.notes && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Observações</h3>
                <p className="mt-1 text-gray-900 italic">"{order.notes}"</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {order.cancelled_at && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <div className="p-6">
            <h3 className="text-lg font-medium text-red-800 mb-2">Ordem Cancelada</h3>
            <p className="text-red-700">
              <span className="font-medium">Data:</span> {new Date(order.cancelled_at).toLocaleString('pt-BR')}
            </p>
            {order.cancel_reason && (
              <p className="mt-2 text-red-700">
                <span className="font-medium">Motivo:</span> {order.cancel_reason}
              </p>
            )}
          </div>
        </Card>
      )}

      {order.status === "done" && !order.rating && (
        <Card className="mb-6">
          <div className="p-6 text-center">
            <button
        onClick={() => setShowModal(true)}
        className="mx-auto block bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
      >
        Avaliar Prestador
      </button>
      <RateProviderModal
        open={showModal}
        onClose={() => setShowModal(false)}
        orderId={orderId}
        onRated={() => {/* atualizar lista ou feedback */}}
      />
          </div>
        </Card>
      )}

      {order.rating && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <div className="p-6">
            <h3 className="text-lg font-medium text-green-800 mb-2">Sua Avaliação</h3>
            <div className="flex items-center">
              {renderStars(order.rating)}
              <span className="ml-2 text-green-700 font-medium">{order.rating}/5</span>
            </div>
            {order.rating_comment && (
              <div className="mt-3">
                <p className="text-sm font-medium text-green-700">Comentário:</p>
                <p className="mt-1 text-green-800 italic">"{order.rating_comment}"</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {showRate && (
        <RateProviderForm
          orderId={order.id}
          onRated={() => {
            setShowRate(false);
            // Atualiza os dados da ordem após avaliação
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
              });
          }}
        />
      )}
    </div>
  );
}