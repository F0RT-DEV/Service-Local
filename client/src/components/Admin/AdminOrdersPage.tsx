import { useEffect, useState } from 'react';
import { Card } from '../UI/Card';

const API_URL = 'http://localhost:3333';

interface Order {
  id: string;
  client_id: string;
  provider_id: string;
  service_id: string;
  status: string;
  created_at: string;
  updated_at?: string;
  scheduled_date?: string;
  notes?: string;
  address?: string;
  client_name?: string;
  provider_name?: string;
}

const statusOptions = [
  'pending',
  'accepted',
  'rejected',
  'in_progress',
  'done',
  'cancelled'
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-blue-100 text-blue-800',
  rejected: 'bg-red-100 text-red-800',
  in_progress: 'bg-purple-100 text-purple-800',
  done: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800'
};

const statusLabels: Record<string, string> = {
  pending: 'Pendente',
  accepted: 'Aceito',
  rejected: 'Rejeitado',
  in_progress: 'Em Progresso',
  done: 'Concluído',
  cancelled: 'Cancelado'
};

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao atualizar status');
      }
      await fetchOrders();
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.provider_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatAddress = (address: string) => {
    if (!address) return '-';
    
    try {
      const addr = typeof address === 'string' ? JSON.parse(address) : address;
      const parts = [
        addr.logradouro,
        addr.numero,
        addr.bairro,
        addr.cidade,
        addr.uf
      ].filter(Boolean);
      
      return parts.join(', ');
    } catch {
      return address;
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
      <Card className="rounded-lg shadow-sm">
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-3 sm:mb-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Todas as Ordens</h2>
              <p className="text-sm sm:text-base text-gray-600">Gerencie todas as ordens da plataforma</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={fetchOrders}
                className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs sm:text-sm"
              >
                Atualizar
              </button>
            </div>
          </div>
        </div>
        
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <label htmlFor="search" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <input
                type="text"
                id="search"
                placeholder="Cliente, prestador ou ID..."
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                id="status"
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos</option>
                {statusOptions.map(opt => (
                  <option key={opt} value={opt}>{statusLabels[opt]}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end sm:col-span-2 lg:col-span-1">
              <span className="text-xs sm:text-sm text-gray-500">
                {filteredOrders.length} {filteredOrders.length === 1 ? 'ordem' : 'ordens'} encontradas
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="px-3 sm:px-6 py-3 sm:py-4 bg-red-50 border-b border-red-200">
            <div className="text-red-600 text-sm">{error}</div>
          </div>
        )}        {loading ? (
          <div className="px-3 sm:px-6 py-8 sm:py-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Mobile Card Layout */}
            <div className="block md:hidden">
              {filteredOrders.length > 0 ? (
                <div className="space-y-3 p-3">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">{order.client_name || 'Cliente não informado'}</div>
                          <div className="text-xs text-gray-500 mt-1">Cliente</div>
                        </div>
                        <select
                          value={order.status}
                          onChange={e => handleStatusChange(order.id, e.target.value)}
                          disabled={updatingId === order.id}
                          className={`text-xs rounded-md px-2 py-1 ${statusColors[order.status]} border border-transparent focus:outline-none focus:ring-1 focus:ring-blue-500`}
                        >
                          {statusOptions.map(opt => (
                            <option key={opt} value={opt}>{statusLabels[opt]}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2 text-xs">
                        <div>
                          <span className="font-medium text-gray-700">Prestador:</span> {order.provider_name || 'Não atribuído'}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Criada em:</span> {new Date(order.created_at).toLocaleString('pt-BR')}
                        </div>
                        {order.address && (
                          <div>
                            <span className="font-medium text-gray-700">Endereço:</span> 
                            <div className="mt-1 text-gray-600 break-words">{formatAddress(order.address)}</div>
                          </div>
                        )}
                      </div>
                      
                      {updatingId === order.id && (
                        <div className="text-xs text-blue-600 font-medium">Atualizando status...</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-8 text-center text-sm text-gray-500">
                  Nenhuma ordem encontrada
                </div>
              )}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prestador
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Criada em
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Endereço
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.client_name || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.provider_name || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={order.status}
                            onChange={e => handleStatusChange(order.id, e.target.value)}
                            disabled={updatingId === order.id}
                            className={`text-sm rounded-md px-3 py-1 ${statusColors[order.status]} border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                          >
                            {statusOptions.map(opt => (
                              <option key={opt} value={opt}>{statusLabels[opt]}</option>
                            ))}
                          </select>
                          {updatingId === order.id && (
                            <span className="ml-2 text-xs text-gray-500">Atualizando...</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleString('pt-BR')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 max-w-xs truncate" title={formatAddress(order.address || '')}>
                            {formatAddress(order.address || '')}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        Nenhuma ordem encontrada
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
        
        {filteredOrders.length > 0 && (
          <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50 text-right">
            <span className="text-xs sm:text-sm text-gray-500">
              Mostrando {filteredOrders.length} de {orders.length} ordens
            </span>
          </div>
        )}
      </Card>
    </div>
  );
}