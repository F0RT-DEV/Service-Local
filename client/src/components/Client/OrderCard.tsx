import { traduzirStatus } from "../UI/orderStatus";

interface OrderCardProps {
  order: {
    id: string;
    service_name?: string;
    provider_name?: string;
    provider_id?: string;
    status: string;
    //price?: number;
    created_at: string;
    scheduled_date?: string;
  };
  onViewDetails: (id: string) => void;
}

export function OrderCard({ order, onViewDetails }: OrderCardProps) {
  return (
    <div className="border rounded-lg p-4 flex flex-col">
      <div className="font-medium text-base">{order.service_name || order.id}</div>
      <div className="text-sm text-gray-500">
        Prestador: {order.provider_name || order.provider_id}
       
      </div>
      <div className="text-sm text-gray-500">
        Status: {traduzirStatus(order.status)}
      </div>
      <div className="text-sm text-gray-500">
        Data: {order.scheduled_date
          ? new Date(order.scheduled_date).toLocaleString()
          : new Date(order.created_at).toLocaleString()}
      </div>
      {/* <div className="text-sm text-gray-500">Valor: R$ {order.price ?? 0}</div> */}
      <button
        className="text-blue-600 hover:underline mt-2 self-start"
        onClick={() => onViewDetails(order.id)}
      >
        Ver detalhes
      </button>
    </div>
  );
}