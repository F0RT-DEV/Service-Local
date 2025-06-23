import { Card } from '../UI/Card';
import { ActionButton } from '../UI/ActionButton';

interface PendingOrder {
  id: string;
  service: string;
  client: string;
  date: string;
  price: number;
  description: string;
}

interface PendingOrderCardProps {
  order: PendingOrder;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export function PendingOrderCard({ order, onAccept, onReject }: PendingOrderCardProps) {
  return (
    <Card hover className="p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-gray-900">{order.service}</h3>
          <p className="text-sm text-gray-600">Cliente: {order.client}</p>
          <p className="text-sm text-gray-500">Data solicitada: {new Date(order.date).toLocaleDateString()}</p>
        </div>
        <p className="text-lg font-bold text-gray-900">R$ {parseFloat(String(order.price || 0)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
      </div>
      <p className="text-sm text-gray-600 mb-3">{order.description}</p>
      <div className="flex space-x-2">
        <ActionButton variant="success" onClick={() => onAccept(order.id)}>
          Aceitar
        </ActionButton>
        <ActionButton variant="danger" onClick={() => onReject(order.id)}>
          Recusar
        </ActionButton>
      </div>
    </Card>
  );
}