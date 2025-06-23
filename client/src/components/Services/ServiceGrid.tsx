
// Grid de exibição dos serviços encontrados na busca.
// Mostra cards com informações resumidas de cada serviço e botão para solicitar.

interface Service {
  id: string;
  category_id: string;
  title: string;
  description: string;
  price_min: number;
  price_max: number;
  images: string;
}

interface ServiceGridProps {
  services: Service[];
  onRequestService: (id: string) => void;
}

export function ServiceGrid({ services, onRequestService }: ServiceGridProps) {
  if (services.length === 0) {
    return (
      <div className="text-center py-12">
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
        <div key={service.id} className="border rounded-lg p-4 flex flex-col">
          <img
            src={service.images || '/placeholder.jpg'}
            alt={service.title}
            className="w-full h-48 object-cover mb-2"
          />
          <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{service.description}</p>          <div className="flex items-center gap-2 mb-2">            <span className="text-green-700 font-bold">
              {service.price_min === service.price_max
                ? `R$ ${parseFloat(String(service.price_min || 0)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                : `R$ ${parseFloat(String(service.price_min || 0)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} - R$ ${parseFloat(String(service.price_max || 0)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            </span>
          </div>
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 mt-auto"
            onClick={() => onRequestService(service.id)}
          >
            Solicitar
          </button>
        </div>
      ))}
    </div>
  );
}