import { useEffect, useState } from 'react';
import { PendingProviderCard } from './PendingProviderCard';
import { ProviderDetailsModal } from './ProviderDetailsModal';

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

export function PendingProvidersPage() {
  const [pendingProviders, setPendingProviders] = useState<PendingProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<PendingProvider | null>(null);
  useEffect(() => {
    fetchPendingProviders();
  }, []);

  const fetchPendingProviders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/providers/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      // Ordena por data decrescente
      const sorted = data.sort(
        (a: PendingProvider, b: PendingProvider) =>
          new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
      );
      setPendingProviders(sorted);
    } catch (err) {
      setPendingProviders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProvider = async (id: string) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/admin/${id}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchPendingProviders();
  };

  const handleRejectProvider = async (id: string) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/admin/${id}/reject`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchPendingProviders();
  };

const handleViewProfile = (id: string) => {
    const provider = pendingProviders.find((p) => p.id === id);
    if (provider) setSelectedProvider(provider);
  };  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Prestadores Pendentes</h2>
      <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
          <span className="text-base sm:text-lg font-semibold text-gray-900">Lista de Prestadores Pendentes</span>
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {pendingProviders.length} pendente(s)
          </span>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : pendingProviders.length === 0 ? (
            <div className="text-gray-500 text-center py-8 text-sm sm:text-base">Nenhum provider pendente.</div>
          ) : (
            pendingProviders.map((provider) => (
              <PendingProviderCard
                key={provider.id}
                provider={{
                  ...provider,
                  email: provider.bio, // Para manter compatibilidade com o componente, exibe bio no lugar do email
                  documents: 'Completos', // ou ajuste conforme necessário
                }}
                onApprove={handleApproveProvider}
                onReject={handleRejectProvider}
                onViewProfile={handleViewProfile}
              />
            ))
          )}
        </div>
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