import { useEffect, useState } from 'react';
import { Star, Calendar, Search, DollarSign } from 'lucide-react';
import { StatsCard } from '../UI/StatsCard';
import { RecommendedServiceCard } from '../Client/RecommendedServiceCard';
import { Card, CardContent, CardHeader } from '../UI/Card';
import { OrderDetails } from '../Client/OrderDetails';
//import { traduzirStatus } from '../UI/orderStatus';
import { RequestOrderModal } from '../Services/RequestOrderModal'; // <-- IMPORTANTE

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

export function ClientDashboard() {  const token = localStorage.getItem('token');
  const [orders, setOrders] = useState<Order[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Estados para o modal de solicitação de serviço recomendado
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

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
      try {
        const res = await fetch('http://localhost:3333/clients/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Erro ao buscar ordens');
        const data = await res.json();
        setOrders(data);
      } catch {
        setOrders([]);
      }
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

  // Quando clicar em solicitar no serviço recomendado, abre o modal
  const handleRequestService = (id: string) => {
    setSelectedServiceId(id);
    setModalOpen(true);
  };

  // Quando a ordem for criada com sucesso
  const handleSuccess = () => {
    alert('Ordem criada com sucesso!');
    setModalOpen(false);
    // Aqui você pode atualizar a lista de ordens, se quiser
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
  <button
    key={order.id}
    onClick={() => handleViewOrderDetails(order.id)}
    className={`
      w-full text-left rounded-xl border border-gray-200 shadow-sm p-4
      transition hover:shadow-md hover:border-blue-400 bg-white
      flex items-center gap-4 group
    `}
  >
    {/* Ícone de status */}
    <div className="flex-shrink-0">
      {order.status === 'pending' && (
        <span className="inline-block w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
          <Calendar className="text-yellow-500" size={22} />
        </span>
      )}
      {order.status === 'accepted' && (
        <span className="inline-block w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <Calendar className="text-blue-500" size={22} />
        </span>
      )}
      {order.status === 'in_progress' && (
        <span className="inline-block w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
          <Calendar className="text-purple-500" size={22} />
        </span>
      )}
      {order.status === 'done' && (
        <span className="inline-block w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <Star className="text-green-600" size={22} />
        </span>
      )}
      {order.status === 'rejected' && (
        <span className="inline-block w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
          <Calendar className="text-red-500" size={22} />
        </span>
      )}
      {order.status === 'cancelled' && (
        <span className="inline-block w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <Calendar className="text-gray-500" size={22} />
        </span>
      )}
    </div>
    {/* Conteúdo principal */}
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-semibold text-base text-gray-900 group-hover:text-blue-700 transition">
          {order.service_name || 'Serviço'}
        </span>
        <span className={`
          text-xs px-2 py-0.5 rounded-full font-medium ml-2
          ${
            order.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : order.status === 'accepted'
              ? 'bg-blue-100 text-blue-800'
              : order.status === 'in_progress'
              ? 'bg-purple-100 text-purple-800'
              : order.status === 'done'
              ? 'bg-green-100 text-green-800'
              : order.status === 'rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-800'
          }
        `}>
          {order.status === 'pending' && 'Pendente'}
          {order.status === 'accepted' && 'Aceita'}
          {order.status === 'in_progress' && 'Em andamento'}
          {order.status === 'done' && 'Finalizada'}
          {order.status === 'rejected' && 'Recusada'}
          {order.status === 'cancelled' && 'Cancelada'}
        </span>
      </div>
      <div className="text-sm text-gray-600">
        <span className="font-medium">Prestador:</span> {order.provider_name || '---'}
      </div>
      <div className="text-xs text-gray-400 mt-1">
        {order.scheduled_date
          ? `Agendada para: ${new Date(order.scheduled_date).toLocaleString('pt-BR')}`
          : order.created_at
          ? `Criada em: ${new Date(order.created_at).toLocaleString('pt-BR')}`
          : ''}
      </div>
    </div>
    {/* Valor e botão Ver detalhes */}
    <div className="flex flex-col items-end">
      {order.price !== undefined && (        <span className="text-green-700 font-bold text-base mb-1">
          R$ {parseFloat(String(order.price || 0)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </span>
      )}
      <span>
        <span
          className="inline-block px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold shadow hover:bg-blue-700 transition"
        >
          Ver detalhes
        </span>
      </span>
    </div>
  </button>
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

      {/* Modal para solicitar serviço recomendado */}
      <RequestOrderModal
        serviceId={selectedServiceId || ''}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}