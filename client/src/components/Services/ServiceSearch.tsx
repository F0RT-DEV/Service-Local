import { useEffect, useState } from 'react';
import { ServiceGrid } from './ServiceGrid';
import { SearchFilters } from './SearchFilters';
import { RequestOrderModal } from './RequestOrderModal';

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

interface Provider {
  id: string; // provider_id
  user_id: string;
  name?: string;
  email?: string;
  phone?: string;
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  numero?: string;
}

export function ServiceSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [location, setLocation] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [users, setUsers] = useState<Provider[]>([]);
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
        setServices(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao buscar serviços');
      }
      setLoading(false);
    };
    fetchServices();
  }, []);

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:3333/users');
      if (!res.ok) throw new Error('Erro ao buscar usuários');
      const data = await res.json();
      setUsers(data);
    } catch {
      setUsers([]);
    }
  };
  fetchUsers();
}, []);

// Mapeia user_id => user (para lookup rápido)
const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

// Filtro por localização (cidade)
const filteredServices = services.filter((service) => {
  const matchesTerm =
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesCategory =
    selectedCategory === 'all' || service.category_id === selectedCategory;

  if (!location.trim()) {
    return matchesTerm && matchesCategory;
  }
  // Busca o usuário (prestador) pelo provider_id do serviço
  const user = userMap[service.provider_id];
  if (!user) return false;
  const matchesLocation =
    user.localidade &&
    user.localidade.toLowerCase().includes(location.trim().toLowerCase());
  return matchesTerm && matchesCategory && matchesLocation;
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
      {!loading && !error && filteredServices.length === 0 && (
        <h1 className="text-center text-lg text-gray-600 mt-8">
          Serviço não encontrado! Verifique se digitou certo
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