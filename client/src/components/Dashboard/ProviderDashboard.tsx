import { useState, useEffect } from 'react';
import { Star, Calendar, DollarSign, Users, Plus } from 'lucide-react';
import { StatsCard } from '../UI/StatsCard';
import { PendingOrderCard } from '../Provider/PendingOrderCard';
import { ServiceCard } from '../Provider/ServiceCard';
import { ProfileAlert } from '../Provider/ProfileAlert';
import { Card, CardContent, CardHeader } from '../UI/Card';
import { ActionButton } from '../UI/ActionButton';
import { CreateService } from '../Provider/CreateService';
import { ServiceDetailsModal } from '../Provider/ServiceDetailsModal';
import { ServiceEditModal } from '../Provider/ServiceEditModal';

export function ProviderDashboard() {
  const [showCreateService, setShowCreateService] = useState(false);
  const [myServices, setMyServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [providerStatus, setProviderStatus] = useState<string | null>(null);

  // Estados para modais
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
    const [averageRating, setAverageRating] = useState<string>('0.0');


  const pendingOrders = [
    // ...existing code...
  ];


  // Busca avaliação média do provider
  useEffect(() => {
    async function fetchAverageRating() {
      try {
        const res = await fetch('http://localhost:3333/providers/ratings/summary', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        setAverageRating(Number(data.average_rating).toFixed(2));
      } catch {
        setAverageRating('0.0');
      }
    }
    fetchAverageRating();
  }, []);
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

  // Carrega status do provider ao montar
  useEffect(() => {
    async function fetchProviderStatus() {
      try {
        const res = await fetch('http://localhost:3333/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        setProviderStatus(data.provider?.status);
      } catch {
        setProviderStatus(null);
      }
    }
    fetchProviderStatus();
  }, []);

  // Atualiza serviço editado
  const handleUpdateService = async (updatedService: any) => {
    try {
      const res = await fetch(`http://localhost:3333/services/${updatedService.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedService),
      });
      if (!res.ok) throw new Error('Erro ao atualizar serviço');
      const updated = await res.json();
      setMyServices((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
    } catch (err) {
      alert('Erro ao atualizar serviço!');
    }
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

      {/* Só mostra o alerta se o status for "pending" */}
      {providerStatus === 'pending' && <ProfileAlert />}

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
          value={averageRating}
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
                  onAccept={() => {}}
                  onReject={() => {}}
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
                    onEdit={() => {
                      setSelectedService(service);
                      setShowEdit(true);
                    }}
                    onViewDetails={() => {
                      setSelectedService(service);
                      setShowDetails(true);
                    }}
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

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
        onSave={handleUpdateService}
      />
    </div>
  );
}