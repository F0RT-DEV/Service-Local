import { useState, useEffect } from 'react';
import { Star, Calendar, DollarSign, Users, Plus } from 'lucide-react';
import { StatsCard } from '../UI/StatsCard';
import { PendingOrderCard } from '../Provider/PendingOrderCard';
import { ServiceCard } from '../Provider/ServiceCard';
import { ProfileAlert } from '../Provider/ProfileAlert';
import { Card, CardContent, CardHeader } from '../UI/Card';
import { ActionButton } from '../UI/ActionButton';
import { CreateService } from '../Provider/CreateService';

export function ProviderDashboard() {
  const [showCreateService, setShowCreateService] = useState(false);
  const [myServices, setMyServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const pendingOrders = [
    // ...existing code...
  ];

  // Carrega serviços do banco ao montar
  useEffect(() => {
    fetch('http://localhost:3333/services/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMyServices(data);
        setLoadingServices(false);
      });
  }, []);

  // Funções para evitar erro de referência
  const handleEditService = () => {
    // Lógica de edição futura
  };

  const handleViewServiceDetails = () => {
    // Lógica de visualização futura
  };

  const handleAcceptOrder = () => {
    // Lógica de aceitar ordem (implemente se necessário)
  };

  const handleRejectOrder = () => {
    // Lógica de rejeitar ordem (implemente se necessário)
  };

  const handleCreateService = () => {
    setShowCreateService(true);
  };

  const handleBackToDashboard = () => {
    setShowCreateService(false);
  };

  // Adiciona novo serviço ao banco e à lista local
  const handleServiceCreated = async (serviceData: any) => {
    setShowCreateService(false);
    try {
      const res = await fetch('http://localhost:3333/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(serviceData),
      });
      if (!res.ok) throw new Error('Erro ao criar serviço');
      const created = await res.json();
      setMyServices((prev) => [created, ...prev]);
    } catch (err) {
      alert('Erro ao cadastrar serviço!');
    }
  };

  if (showCreateService) {
    return <CreateService onBack={handleBackToDashboard} onCreate={handleServiceCreated} />;
  }

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
              {loadingServices ? (
                <div>Carregando...</div>
              ) : (
                myServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onEdit={handleEditService}
                    onViewDetails={handleViewServiceDetails}
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}