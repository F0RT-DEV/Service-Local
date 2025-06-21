import React from 'react';
import { Card } from '../UI/Card';
import { StatusBadge } from '../UI/StatusBadge';

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
    <Card hover className="p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{service.title}</h3>
          <p className="text-sm text-gray-600 mb-1">{service.description}</p>
          {service.category && (
            <p className="text-xs text-gray-500 mb-1">Categoria: {service.category}</p>
          )}
          <p className="text-xs text-gray-500">
            {service.requests !== undefined
              ? `${service.requests} solicitação(ões) recebida(s)`
              : ''}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">
            R$ {service.price_min} - R$ {service.price_max}
          </p>
          <StatusBadge
            status={service.is_active ? 'ativo' : 'inativo'}
            variant={service.is_active ? 'success' : 'danger'}
          >
            {service.is_active ? 'Ativo' : 'Inativo'}
          </StatusBadge>
        </div>
      </div>
      <div className="mt-3 flex justify-end space-x-3">
        <button
          onClick={() => onEdit(service.id)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Editar
        </button>
        <button
          onClick={() => onViewDetails(service.id)}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          Ver detalhes
        </button>
      </div>
    </Card>
  );
}