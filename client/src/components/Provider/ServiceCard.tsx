
import { Card } from '../UI/Card';
import { StatusBadge } from '../UI/StatusBadge';
import { BadgeCheck, Edit2, Info } from "lucide-react";
interface Service {
  id: string;
  title: string;
  description: string;
  price_min: number;
  price_max: number;
  category?: string;
  images?: string;
  is_active?: boolean;
  requests?: number; // opcional, se quiser mostrar
}

interface ServiceCardProps {
  service: Service;
  onEdit: (id: string) => void;
  onViewDetails: (id: string) => void;
}

export function ServiceCard({ service, onEdit, onViewDetails }: ServiceCardProps) {
  return (
    <Card hover className="p-5 bg-gradient-to-br from-orange-50 to-white border border-orange-100 shadow-md transition hover:shadow-lg">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-bold text-orange-700 text-lg flex items-center gap-1 mb-1">
            <BadgeCheck className="text-orange-400" size={18} />
            {service.title}
          </h3>
          <p className="text-sm text-gray-700 mb-2">{service.description}</p>
          {service.category && (
            <span className="inline-block text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded mb-1">
              {service.category}
            </span>
          )}
          {service.requests !== undefined && (
            <p className="text-xs text-gray-500 mt-1">
              {service.requests} solicitação(ões) recebida(s)
            </p>
          )}
        </div>
        <div className="text-right min-w-[120px] flex flex-col items-end gap-2">
          <span className="text-base font-bold text-gray-900">
            R$ {service.price_min?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} - R$ {service.price_max?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
          <StatusBadge
            status={service.is_active ? 'ativo' : 'inativo'}
            variant={service.is_active ? 'success' : 'error'}
          >
            {service.is_active ? 'Ativo' : 'Inativo'}
          </StatusBadge>
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-4">
        <button
          onClick={() => onEdit(service.id)}
          className="flex items-center gap-1 text-sm text-blue-600 font-semibold hover:underline transition"
        >
          <Edit2 size={15} /> Editar
        </button>
        <button
          onClick={() => onViewDetails(service.id)}
          className="flex items-center gap-1 text-sm text-gray-700 font-semibold hover:underline transition"
        >
          <Info size={15} /> Ver detalhes
        </button>
      </div>
    </Card>
  );
}