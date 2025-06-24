
import { Star } from 'lucide-react';
import { Card } from '../UI/Card';
import { ActionButton } from '../UI/ActionButton';

//Card de serviço recomendado para o cliente.
// Mostra informações do serviço, prestador, nota e preço.
// Possui botão para solicitar o serviço (aciona função onRequest).

interface RecommendedServiceCardProps {
   service: {
    id: string;
    title: string;
     description: string; // <-- adicione aqui
    rating: number;
    price: number;
    image: string;
  };
  onRequest: (id: string) => void;
}

export function RecommendedServiceCard({ service, onRequest }: RecommendedServiceCardProps) {
  return (
    <Card hover className="p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-32 sm:w-16 sm:h-16 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 text-sm sm:text-base">{service.title}</h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{service.description}</p>
          <div className="flex items-center mt-1 sm:mt-2">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
            <span className="text-xs sm:text-sm text-gray-600 ml-1">{service.rating}</span>
          </div>
        </div>
          <div className="w-full sm:w-auto text-center sm:text-right">
          <div className="text-sm sm:text-base text-green-700 font-bold mb-2">
            Valor: R$ {parseFloat(String(service.price || 0)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
          <div className="w-full sm:w-auto">
            <ActionButton size="sm" onClick={() => onRequest(service.id)}>
              Solicitar
            </ActionButton>
          </div>
        </div>
      </div>
    </Card>
  );
}