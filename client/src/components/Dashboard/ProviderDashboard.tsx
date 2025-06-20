import { Star, Calendar, DollarSign, Users, Plus } from 'lucide-react';
import { StatsCard } from '../UI/StatsCard';
import { PendingOrderCard } from '../Provider/PendingOrderCard';
import { ServiceCard } from '../Provider/ServiceCard';
import { ProfileAlert } from '../Provider/ProfileAlert';
import { Card, CardContent, CardHeader } from '../UI/Card';
import { ActionButton } from '../UI/ActionButton';

export function ProviderDashboard() {
  const pendingOrders = [
    {
      id: '1',
      service: 'Instalação de Ar Condicionado',
      client: 'João Cliente',
      date: '2024-01-15',
      price: 250,
      description: 'Instalação de ar condicionado split 12000 BTUs em quarto'
    },
    {
      id: '2',
      service: 'Manutenção Elétrica',
      client: 'Maria Silva',
      date: '2024-01-16',
      price: 180,
      description: 'Verificação e reparo de tomadas e interruptores'
    }
  ];

  const myServices = [
    {
      id: '1',
      title: 'Instalação de Ar Condicionado',
      price: 250,
      requests: 5,
      status: 'active'
    },
    {
      id: '2',
      title: 'Manutenção Elétrica',
      price: 120,
      requests: 3,
      status: 'active'
    }
  ];

  const handleAcceptOrder = (id: string) => {
    console.log('Accepting order:', id);
  };

  const handleRejectOrder = (id: string) => {
    console.log('Rejecting order:', id);
  };

  const handleEditService = (id: string) => {
    console.log('Editing service:', id);
  };

  const handleViewServiceDetails = (id: string) => {
    console.log('Viewing service details:', id);
  };

  const handleCreateService = () => {
    console.log('Creating new service');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard do Prestador</h1>
        <p className="text-gray-600">Gerencie seus serviços e ordens recebidas.</p>
      </div>

      <ProfileAlert />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          icon={Calendar}
          iconColor="text-blue-600"
          title="Ordens Pendentes"
          value="2"
        />
        <StatsCard
          icon={Users}
          iconColor="text-green-600"
          title="Clientes Ativos"
          value="8"
        />
        <StatsCard
          icon={Star}
          iconColor="text-yellow-600"
          title="Avaliação Média"
          value="4.8"
        />
        <StatsCard
          icon={DollarSign}
          iconColor="text-orange-600"
          title="Faturamento"
          value="R$ 3.850"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Orders */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Ordens Pendentes</h2>
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {pendingOrders.length} nova(s)
            </span>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingOrders.map((order) => (
                <PendingOrderCard
                  key={order.id}
                  order={order}
                  onAccept={handleAcceptOrder}
                  onReject={handleRejectOrder}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Services */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Meus Serviços</h2>
            <ActionButton icon={Plus} onClick={handleCreateService}>
              Novo Serviço
            </ActionButton>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onEdit={handleEditService}
                  onViewDetails={handleViewServiceDetails}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}