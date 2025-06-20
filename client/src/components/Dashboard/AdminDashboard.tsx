import React from 'react';
import { Users, Shield, FileText, TrendingUp } from 'lucide-react';
import { StatsCard } from '../UI/StatsCard';
import { PendingProviderCard } from '../Admin/PendingProviderCard';
import { ActivityFeed } from '../Admin/ActivityFeed';
import { QuickActions } from '../Admin/QuickActions';

export function AdminDashboard() {
  const pendingProviders = [
    {
      id: '1',
      name: 'Carlos Silva',
      email: 'carlos@email.com',
      specialties: ['Elétrica', 'Hidráulica'],
      documents: 'Completos',
      requestDate: '2024-01-10'
    },
    {
      id: '2',
      name: 'Ana Santos',
      email: 'ana@email.com',
      specialties: ['Limpeza', 'Jardinagem'],
      documents: 'Pendentes',
      requestDate: '2024-01-12'
    }
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'provider_approved',
      message: 'Provider Maria Santos foi aprovada',
      time: '2 horas atrás'
    },
    {
      id: '2',
      type: 'service_created',
      message: 'Novo serviço "Jardinagem" foi criado',
      time: '4 horas atrás'
    },
    {
      id: '3',
      type: 'order_completed',
      message: 'Ordem #123 foi concluída',
      time: '6 horas atrás'
    }
  ];

  const handleApproveProvider = (id: string) => {
    console.log('Approving provider:', id);
  };

  const handleRejectProvider = (id: string) => {
    console.log('Rejecting provider:', id);
  };

  const handleViewProfile = (id: string) => {
    console.log('Viewing profile:', id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
        <p className="text-gray-600">Gerencie providers, serviços e monitore o sistema.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          icon={Users}
          iconColor="text-blue-600"
          title="Total Usuários"
          value="248"
        />
        <StatsCard
          icon={Shield}
          iconColor="text-yellow-600"
          title="Providers Pendentes"
          value={pendingProviders.length}
        />
        <StatsCard
          icon={FileText}
          iconColor="text-green-600"
          title="Ordens Ativas"
          value="42"
        />
        <StatsCard
          icon={TrendingUp}
          iconColor="text-orange-600"
          title="Receita Total"
          value="R$ 12.5k"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Providers */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Providers Pendentes</h2>
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {pendingProviders.length} pendente(s)
            </span>
          </div>
          <div className="space-y-4">
            {pendingProviders.map((provider) => (
              <PendingProviderCard
                key={provider.id}
                provider={provider}
                onApprove={handleApproveProvider}
                onReject={handleRejectProvider}
                onViewProfile={handleViewProfile}
              />
            ))}
          </div>
        </div>

        <ActivityFeed activities={recentActivities} />
      </div>

      <QuickActions />
    </div>
  );
}