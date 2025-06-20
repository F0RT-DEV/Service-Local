
import { Search, Star, Calendar, DollarSign } from 'lucide-react';
import { StatsCard } from '../UI/StatsCard';
import { OrderCard } from '../Client/OrderCard';
import { RecommendedServiceCard } from '../Client/RecommendedServiceCard';
import { Card, CardContent, CardHeader } from '../UI/Card';

export function ClientDashboard() {
  const recentOrders = [
    {
      id: '1',
      service: 'Instalação de Ar Condicionado',
      provider: 'João Silva',
      status: 'pending',
      price: 250,
      date: '2024-01-15'
    },
    {
      id: '2',
      service: 'Limpeza Residencial',
      provider: 'Maria Santos',
      status: 'in_progress',
      price: 120,
      date: '2024-01-12'
    }
  ];

  const recommendedServices = [
    {
      id: '1',
      title: 'Encanamento Residencial',
      provider: 'Carlos Pereira',
      rating: 4.8,
      price: 80,
      image: 'https://images.pexels.com/photos/834949/pexels-photo-834949.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      title: 'Jardinagem e Paisagismo',
      provider: 'Ana Costa',
      rating: 4.9,
      price: 150,
      image: 'https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const handleViewOrderDetails = (id: string) => {
    console.log('Viewing order details:', id);
  };

  const handleRequestService = (id: string) => {
    console.log('Requesting service:', id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard do Cliente</h1>
        <p className="text-gray-600">Bem-vindo! Gerencie suas solicitações de serviços.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          icon={Search}
          iconColor="text-blue-600"
          title="Pesquisas"
          value="12"
        />
        <StatsCard
          icon={Calendar}
          iconColor="text-green-600"
          title="Ordens Ativas"
          value="3"
        />
        <StatsCard
          icon={Star}
          iconColor="text-yellow-600"
          title="Avaliações"
          value="8"
        />
        <StatsCard
          icon={DollarSign}
          iconColor="text-orange-600"
          title="Total Gasto"
          value="R$ 1.240"
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