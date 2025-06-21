import { useEffect, useState } from 'react';
import { ServiceCard } from '../Provider/ServiceCard';
import { ServiceDetailsModal } from '../Provider/ServiceDetailsModal';
import { ServiceEditModal } from '../Provider/ServiceEditModal';

interface Service {
  id: string;
  category_id: string;
  title: string;
  description: string;
  price_min: number;
  price_max: number;
  images: string;
  is_active?: boolean;
}

interface Category {
  id: string;
  name: string;
}

export function ServiceSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Modais
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  // Buscar categorias
  useEffect(() => {
    fetch('http://localhost:3333/categories')
      .then(res => res.json())
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // Buscar serviços do próprio prestador autenticado
  useEffect(() => {
    const fetchMyServices = async () => {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Você precisa estar logado para ver seus serviços.');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('http://localhost:3333/services/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Erro ao buscar seus serviços');
        const data = await res.json();
        setServices(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao buscar seus serviços');
      }
      setLoading(false);
    };
    fetchMyServices();
  }, []);

  // Filtros simples
  const filteredServices = services.filter((service) => {
    const matchesTerm =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || service.category_id === selectedCategory;
    return matchesTerm && matchesCategory;
  });

  const getCategoryName = (id: string) =>
    categories.find((cat) => cat.id === id)?.name || 'Sem categoria';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Buscar serviço..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/3"
        />
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/4"
        >
          <option value="all">Todas as categorias</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      {loading && <div>Carregando serviços...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredServices.length === 0 && (
            <div className="col-span-full text-center text-gray-500">
              Nenhum serviço encontrado.
            </div>
          )}
          {filteredServices.map(service => (
            <ServiceCard
              key={service.id}
              service={{
                ...service,
                category: getCategoryName(service.category_id),
              }}
              onEdit={() => {
                setSelectedService(service);
                setShowEdit(true);
              }}
              onViewDetails={() => {
                setSelectedService(service);
                setShowDetails(true);
              }}
            />
          ))}
        </div>
      )}
      {/* Modais */}
      <ServiceDetailsModal
        open={showDetails}
        service={selectedService}
        onClose={() => setShowDetails(false)}
      />
      <ServiceEditModal
        open={showEdit}
        service={selectedService}
        onClose={() => setShowEdit(false)}
        onSave={() => {}} // Implemente se quiser edição real
      />
    </div>
  );
}