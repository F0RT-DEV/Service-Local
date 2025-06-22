import { useEffect, useState } from 'react';
import { Star, Calendar, Search, DollarSign } from 'lucide-react';
import { StatsCard } from '../UI/StatsCard';
import { OrderCard } from '../Client/OrderCard';
import { RecommendedServiceCard } from '../Client/RecommendedServiceCard';
import { Card, CardContent, CardHeader } from '../UI/Card';
import { OrderDetails } from '../Client/OrderDetails';
//import { traduzirStatus } from '../UI/orderStatus';

interface Order {
  id: string;
  service_name?: string;
  provider_name?: string;
  provider_id?: string;
  status: string;
  price?: number;
  created_at: string;
  scheduled_date?: string;
  rating?: number;
  search_term?: string; // se você salvar pesquisas do usuário
}

interface Service {
  id: string;
  title: string;
  description: string;
  provider_name?: string;
  provider_id: string;
  price_min: number;
  images: string;
  rating?: number;
}

export function ClientDashboard() {
  const token = localStorage.getItem('token');
  const [orders, setOrders] = useState<Order[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searches, setSearches] = useState<string[]>([]); // Simulação de pesquisas

  // ...seus estados...
  const [finishedOrdersCount, setFinishedOrdersCount] = useState(0);
  const [uniqueProvidersCount, setUniqueProvidersCount] = useState(0);

  // Buscar total de ordens finalizadas
  useEffect(() => {
    const fetchFinishedOrdersCount = async () => {
      try {
        const res = await fetch('http://localhost:3333/clients/orders/finished/count', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setFinishedOrdersCount(data.total || 0);
      } catch {
        setFinishedOrdersCount(0);
      }
    };
    if (token) fetchFinishedOrdersCount();
  }, [token]);

  // Buscar total de prestadores diferentes
  useEffect(() => {
    const fetchUniqueProvidersCount = async () => {
      try {
        const res = await fetch('http://localhost:3333/clients/providers/unique/count', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUniqueProvidersCount(data.total || 0);
      } catch {
        setUniqueProvidersCount(0);
      }
    };
    if (token) fetchUniqueProvidersCount();
  }, [token]);

  // Buscar ordens do cliente
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3333/clients/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Erro ao buscar ordens');
        const data = await res.json();
        setOrders(data);

        // Simulação: se você salva pesquisas no backend, troque por fetch real
        const pesquisas = data
          .map((o: Order) => o.search_term)
          .filter((v: string | undefined) => !!v) as string[];
        setSearches(pesquisas);
      } catch {
        setOrders([]);
        setSearches([]);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [token]);

  // Buscar serviços recomendados (por avaliação)
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('http://localhost:3333/services');
        if (!res.ok) throw new Error('Erro ao buscar serviços');
        const data = await res.json();
        setServices(data);
      } catch {
        setServices([]);
      }
    };
    fetchServices();
  }, []);

  // Ordens recentes (últimas 3)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  // Ordens ativas
  const activeOrdersCount = orders.filter(
    (o) => ['pending', 'accepted', 'in_progress'].includes(o.status)
  ).length;

  // Avaliações feitas
  const ratingsCount = orders.filter((o) => o.rating != null).length;

  // Total gasto (soma dos valores das ordens finalizadas)
  const totalSpent = orders
  .filter((o) => ['done'].includes(o.status))
  .reduce((sum, o) => sum + (o.price ?? 0), 0);

  // Serviços recomendados: top 2 por avaliação
const recommendedServices = [...services]
  .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
  .slice(0, 2)
  .map((service) => ({
    id: service.id,
    title: service.title,
    description: service.description, // <-- adicione a descrição
    rating: service.rating ?? 0,
    price: service.price_min,
    image: service.images,
  }));

  const handleViewOrderDetails = (id: string) => {
    setSelectedOrderId(id);
  };

  const handleBack = () => {
    setSelectedOrderId(null);
  };

  const handleRequestService = (id: string) => {
    // Implemente ação de solicitar serviço se necessário
  };

  if (selectedOrderId) {
    return <OrderDetails orderId={selectedOrderId} onBack={handleBack} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard do Cliente</h1>
        <p className="text-gray-600">Bem-vindo! Gerencie suas solicitações de serviços.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          icon={Calendar}
          iconColor="text-green-600"
          title="Ordens Ativas"
          value={activeOrdersCount.toString()}
        />
        <StatsCard
          icon={Star}
          iconColor="text-yellow-600"
          title="Avaliações"
          value={ratingsCount.toString()}
        />
        <StatsCard
          icon={DollarSign}
          iconColor="text-blue-700"
          title="Ordens Finalizadas"
          value={finishedOrdersCount.toString()}
        />
        <StatsCard
          icon={Search}
          iconColor="text-purple-600"
          title="Prestadores Contratados"
          value={uniqueProvidersCount.toString()}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Ordens Recentes</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length === 0 && (
                <p className="text-gray-500">Você ainda não fez nenhuma ordem.</p>
              )}
              {recentOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onViewDetails={handleViewOrderDetails}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommended Services */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Serviços Recomendados</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendedServices.length === 0 && (
                <p className="text-gray-500">Nenhum serviço recomendado no momento.</p>
              )}
              {recommendedServices.map((service) => (
                <RecommendedServiceCard
                  key={service.id}
                  service={service}
                  onRequest={handleRequestService}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}