import React from 'react';
import { Search, Star, MapPin, DollarSign } from 'lucide-react';
import { Card } from '../UI/Card';
import { ActionButton } from '../UI/ActionButton';

interface Service {
  id: string;
  title: string;
  provider: string;
  category: string;
  rating: number;
  reviewsCount: number;
  price: number;
  priceType: string;
  location: string;
  description: string;
  image: string;
}

interface ServiceGridProps {
  services: Service[];
  onRequestService: (id: string) => void;
}

export function ServiceGrid({ services, onRequestService }: ServiceGridProps) {
  const getPriceText = (service: Service) => {
    switch (service.priceType) {
      case 'hourly':
        return `R$ ${service.price}/hora`;
      case 'negotiable':
        return 'Preço negociável';
      default:
        return `R$ ${service.price}`;
    }
  };

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum serviço encontrado</h3>
        <p className="mt-1 text-sm text-gray-500">
          Tente ajustar os filtros ou termos de busca.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {services.map((service) => (
        <Card key={service.id} hover className="overflow-hidden">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {service.title}
              </h3>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">{service.rating}</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">por {service.provider}</p>
            
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              {service.location}
            </div>
            
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {service.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-lg font-bold text-gray-900 ml-1">
                  {getPriceText(service)}
                </span>
              </div>
              <ActionButton onClick={() => onRequestService(service.id)}>
                Solicitar
              </ActionButton>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                {service.reviewsCount} avaliações
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}