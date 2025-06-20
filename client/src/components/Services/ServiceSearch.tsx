import { useEffect, useState } from 'react';
import { ServiceGrid } from './ServiceGrid';
import { SearchFilters } from './SearchFilters';
import { RequestOrderModal } from './RequestOrderModal';

interface Service {
  id: string;
  category_id: string;
  title: string;
  description: string;
  price_min: number;
  price_max: number;
  images: string;
}

export function ServiceSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [location, setLocation] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  // Buscar serviços do backend ao carregar
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:3333/services');
        if (!res.ok) throw new Error('Erro ao buscar serviços');
        const data = await res.json();
        // Mapeia apenas os campos do schema
        const mapped = data.map((service: any) => ({
          id: service.id,
          category_id: service.category_id,
          title: service.title,
          description: service.description,
          price_min: service.price_min,
          price_max: service.price_max,
          images: service.images,
        }));
        setServices(mapped);
      } catch (err: any) {
        setError(err.message || 'Erro ao buscar serviços');
      }
      setLoading(false);
    };
    fetchServices();
  }, []);

  // Filtros simples (pode adaptar conforme necessário)
  const filteredServices = services.filter((service) => {
    const matchesTerm =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || service.category_id === selectedCategory;
    // location não existe no schema, então filtro só por termo e categoria
    return matchesTerm && matchesCategory;
  });

  const handleRequestService = (id: string) => {
    setSelectedServiceId(id);
    setModalOpen(true);
  };

  const handleSuccess = () => {
    alert('Ordem criada com sucesso!');
    // Aqui você pode atualizar a lista de ordens, se quiser
  };

  return (
    <div className="space-y-6">
      <SearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        location={location}
        setLocation={setLocation}
      />
      {loading && <div>Carregando serviços...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <ServiceGrid services={filteredServices} onRequestService={handleRequestService} />
      )}
      <RequestOrderModal
        serviceId={selectedServiceId || ''}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}