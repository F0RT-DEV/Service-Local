import React from 'react';
import { Card } from '../UI/Card';
import { StatusBadge } from '../UI/StatusBadge';

interface Service {
  id: string;
  title: string;
  price: number;
  requests: number;
  status: string;
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
          <p className="text-sm text-gray-600">
            {service.requests} solicitação(ões) recebida(s)
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">R$ {service.price}</p>
          <StatusBadge status={service.status} variant="success">
            Ativo
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