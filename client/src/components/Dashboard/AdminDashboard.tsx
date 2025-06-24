import { useEffect, useState } from 'react';
import { Users, Shield, FileText, TrendingUp } from 'lucide-react';
import { StatsCard } from '../UI/StatsCard';
import { PendingProviderCard } from '../Admin/PendingProviderCard';
import { QuickActions } from '../Admin/QuickActions';
import { ProviderDetailsModal } from '../Admin/ProviderDetailsModal';

const API_URL = 'http://localhost:3333';

interface PendingProvider {
  id: string;
  name: string;
  bio: string;
  specialties: string[];
  status: string;
  requestDate: string;
  cnpj?: string;
}

export function AdminDashboard({
  onManageUsers,
  onServiceSettings,
  onStatistics,
}: {
  onManageUsers: () => void;
  onServiceSettings: () => void;
  onStatistics: () => void;
}) {
  const [pendingProviders, setPendingProviders] = useState<PendingProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
const [selectedProvider, setSelectedProvider] = useState<PendingProvider | null>(null);

  useEffect(() => {
    fetchPendingProviders();
    fetchTotalUsers();
    fetchTotalOrders();
  }, []);

  const fetchPendingProviders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/providers/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const sorted = data
        .sort(
          (a: PendingProvider, b: PendingProvider) =>
            new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
        )
        .slice(0, 2);
      setPendingProviders(sorted);
    } catch (err) {
      setPendingProviders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTotalUsers(data.total_users || 0);
    } catch {
      setTotalUsers(0);
    }
  };

  const fetchTotalOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTotalOrders(Array.isArray(data) ? data.length : 0);
    } catch {
      setTotalOrders(0);
    }
  };

  const handleApproveProvider = async (id: string) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/admin/${id}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPendingProviders();
  };

  const handleRejectProvider = async (id: string) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/admin/${id}/reject`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPendingProviders();
  };


  const handleViewProfile = (id: string) => {
    const provider = pendingProviders.find((p) => p.id === id);
    if (provider) setSelectedProvider(provider);
  };
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
        <p className="text-gray-600">Gerencie providers, serviços e monitore o sistema.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          icon={Users}
          iconColor="text-blue-600"
          title="Total Usuários"
          value={totalUsers}
        />
        <StatsCard
          icon={Shield}
          iconColor="text-yellow-600"
          title="Prestadores Pendentes"
          value={pendingProviders.length}
        />
        <StatsCard
          icon={FileText}
          iconColor="text-green-600"
          title="Ordens Ativas"
          value={totalOrders}
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
            <h2 className="text-lg font-semibold text-gray-900">Prestadores Pendentes</h2>
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {pendingProviders.length} pendente(s)
            </span>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div>Carregando...</div>
            ) : pendingProviders.length === 0 ? (
              <div className="text-gray-500">Nenhum prestador pendente.</div>
            ) : (
              pendingProviders.map((provider) => (
                <PendingProviderCard
                  key={provider.id}
                  provider={{
                    ...provider,
                    email: provider.bio,
                    documents: 'Completos',
                  }}
                  onApprove={handleApproveProvider}
                  onReject={handleRejectProvider}
                  onViewProfile={handleViewProfile}
                />
              ))
            )}
          </div>
        </div>
        {/* Ações rápidas */}
        <QuickActions
          onManageUsers={onManageUsers}
          onServiceSettings={onServiceSettings}
          onStatistics={onStatistics}
        />
      </div>
      {selectedProvider && (
        <ProviderDetailsModal
          provider={selectedProvider}
          onClose={() => setSelectedProvider(null)}
        />
      )}
    </div>
  );
}