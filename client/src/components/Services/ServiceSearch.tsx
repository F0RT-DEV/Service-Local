import { useEffect, useState } from 'react';
import { ServiceGrid } from './ServiceGrid';
import { SearchFilters } from './SearchFilters';
import { RequestOrderModal } from './RequestOrderModal';
import { usePromptAlerts } from '../UI/AlertContainer';

interface Service {
  id: string;
  provider_id: string;
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
  const alerts = usePromptAlerts();

  // Buscar serviços do backend ao carregar
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError('');
      try {        const res = await fetch('http://localhost:3333/services');
        if (!res.ok) throw new Error('Erro ao buscar serviços');
        const data = await res.json();
        setServices(data);
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao buscar serviços';
        setError(errorMessage);
        alerts.error(errorMessage, 'Erro ao Carregar Serviços');
      }      setLoading(false);
    };
    fetchServices();  }, []);

  // Filtro por termo de busca e categoria
  const filteredServices = services.filter((service) => {
    const matchesTerm =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || service.category_id === selectedCategory;

    return matchesTerm && matchesCategory;
  });

  const handleRequestService = (id: string) => {
    setSelectedServiceId(id);
    setModalOpen(true);
  };
  const handleSuccess = () => {
    alerts.success('Ordem criada com sucesso!', 'Solicitação Enviada', 6000);
    // Aqui você pode atualizar a lista de ordens, se quiser
  };
  return (
    <div className="space-y-4">
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
      {!loading && !error && filteredServices.length === 0 && (
        <h1 className="text-center text-lg text-gray-600 mt-8">
          Serviço não encontrado!
        </h1>
      )}
      {!loading && !error && filteredServices.length > 0 && (
        <ServiceGrid
          services={filteredServices}
          onRequestService={handleRequestService}
        />
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