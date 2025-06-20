
import { Eye } from 'lucide-react';
import { Card } from '../UI/Card';
import { StatusBadge } from '../UI/StatusBadge';
import { ActionButton } from '../UI/ActionButton';

interface Order {
  id: string;
  service: string;
  provider: string;
  status: string;
  price: number;
  date: string;
}

interface OrderCardProps {
  order: Order;
  onViewDetails: (id: string) => void;
}

export function OrderCard({ order, onViewDetails }: OrderCardProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'in_progress': return 'default';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in_progress': return 'Em Andamento';
      case 'completed': return 'Concluído';
      default: return status;
    }
  };

  return (
    <Card hover className="p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{order.service}</h3>
          <p className="text-sm text-gray-600">por {order.provider}</p>
          <p className="text-sm text-gray-500">Data: {new Date(order.date).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <StatusBadge status={order.status} variant={getStatusVariant(order.status)}>
            {getStatusText(order.status)}
          </StatusBadge>
          <p className="text-lg font-bold text-gray-900 mt-1">R$ {order.price}</p>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <ActionButton variant="primary" icon={Eye} onClick={() => onViewDetails(order.id)}>
          Ver detalhes
        </ActionButton>
      </div>
    </Card>
  );
}