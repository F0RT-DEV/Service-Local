import React from 'react';
import { Star } from 'lucide-react';
import { Card } from '../UI/Card';
import { ActionButton } from '../UI/ActionButton';

interface RecommendedService {
  id: string;
  title: string;
  provider: string;
  rating: number;
  price: number;
  image: string;
}

interface RecommendedServiceCardProps {
  service: RecommendedService;
  onRequest: (id: string) => void;
}

export function RecommendedServiceCard({ service, onRequest }: RecommendedServiceCardProps) {
  return (
    <Card hover className="p-4">
      <div className="flex items-start space-x-4">
        <img
          src={service.image}
          alt={service.title}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{service.title}</h3>
          <p className="text-sm text-gray-600">por {service.provider}</p>
          <div className="flex items-center mt-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">{service.rating}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">R$ {service.price}</p>
          <ActionButton size="sm" onClick={() => onRequest(service.id)}>
            Solicitar
          </ActionButton>
        </div>
      </div>
    </Card>
  );
}