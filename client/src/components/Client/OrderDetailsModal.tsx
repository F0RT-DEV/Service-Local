import { useEffect, useState } from 'react';
import { X, Calendar, User, MapPin, FileText, DollarSign, Star } from 'lucide-react';

interface OrderDetailsModalProps {
  orderId: string;
  open: boolean;
  onClose: () => void;
  onRateProvider?: (orderId: string) => void; // Nova prop para avaliar
}

interface OrderDetails {
  id: string;
  service_name: string;
  provider_name: string;
  client_name: string;
  status: string;
  price?: number;
  created_at: string;
  scheduled_date?: string;
  notes?: string;
  address?: any; // Pode ser string ou objeto JSON
  rating?: number;
  rating_comment?: string;
  provider_phone?: string;
  provider_email?: string;
}

export function OrderDetailsModal({ orderId, open, onClose, onRateProvider }: OrderDetailsModalProps) {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && orderId) {
      fetchOrderDetails();
    }
  }, [open, orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('Você precisa estar logado.');
      setLoading(false);
      return;
    }    try {
      const res = await fetch(`http://localhost:3333/clients/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error('Erro ao buscar detalhes da ordem');
      
      const data = await res.json();
      setOrderDetails(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar detalhes da ordem');
    }    setLoading(false);
  };

  const formatAddress = (address: any) => {
    if (!address) return '';
    
    // Se for string, retorna como está
    if (typeof address === 'string') {
      try {
        address = JSON.parse(address);
      } catch {
        return address;
      }
    }
    
    // Se for objeto, formata
    if (typeof address === 'object') {
      const parts = [];
      if (address.logradouro) parts.push(address.logradouro);
      if (address.complemento) parts.push(address.complemento);
      if (address.bairro) parts.push(address.bairro);
      if (address.cidade) parts.push(address.cidade);
      if (address.uf) parts.push(address.uf);
      if (address.cep) parts.push(`CEP: ${address.cep}`);
      return parts.join(', ');
    }
    
    return address;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'done':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'accepted': return 'Aceita';
      case 'in_progress': return 'Em Andamento';
      case 'done': return 'Finalizada';
      case 'rejected': return 'Recusada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  if (!open) return null;  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-2xl sm:max-w-3xl w-full max-h-[95vh] sm:max-h-[88vh] overflow-hidden flex flex-col mt-8 sm:mt-0">
        {/* Header do Modal */}
        <div className="flex items-center justify-between p-2 sm:p-3 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Detalhes da Ordem</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </button>
        </div>

        {/* Conteúdo do Modal */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3">
          {loading && (
            <div className="flex items-center justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Carregando detalhes...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-3 text-sm">
              {error}
            </div>
          )}

          {orderDetails && (            <div className="space-y-1.5 sm:space-y-2">
              {/* Status e Serviço */}
              <div className="bg-gray-50 rounded-xl p-1.5 sm:p-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    {orderDetails.service_name}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(orderDetails.status)}`}>
                    {getStatusText(orderDetails.status)}
                  </span>
                </div>
              </div>

              {/* Informações do Prestador */}
              <div className="bg-blue-50 rounded-xl p-1.5 sm:p-2 border border-blue-100">
                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  <h4 className="font-semibold text-blue-800 text-xs sm:text-sm">Prestador de Serviço</h4>
                </div>
                <p className="text-gray-700 font-medium text-xs sm:text-sm">{orderDetails.provider_name}</p>
              </div>

              {/* Informações da Ordem */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5 sm:gap-2">
                {/* Datas */}
                <div className="bg-white border border-gray-200 rounded-xl p-1.5 sm:p-2">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                    <h4 className="font-semibold text-gray-800 text-xs sm:text-sm">Datas</h4>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div>
                      <span className="text-gray-600">Criada em:</span>
                      <p className="font-medium">
                        {new Date(orderDetails.created_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    {orderDetails.scheduled_date && (
                      <div>
                        <span className="text-gray-600">Agendada para:</span>
                        <p className="font-medium">
                          {new Date(orderDetails.scheduled_date).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preço */}
                {orderDetails.price !== undefined && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-1.5 sm:p-2">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1">
                      <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                      <h4 className="font-semibold text-green-800 text-xs sm:text-sm">Valor</h4>
                    </div>
                    <p className="text-base sm:text-lg font-bold text-green-700">
                      R$ {parseFloat(String(orderDetails.price)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                )}
              </div>

              {/* Grid para Endereço e Observações */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5 sm:gap-2">
                {/* Endereço */}
                {orderDetails.address && (
                  <div className="bg-white border border-gray-200 rounded-xl p-1.5 sm:p-2">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                      <h4 className="font-semibold text-gray-800 text-xs sm:text-sm">Endereço</h4>
                    </div>
                    <p className="text-gray-700 text-xs sm:text-sm">{formatAddress(orderDetails.address)}</p>
                  </div>
                )}

                {/* Observações */}
                {orderDetails.notes && (
                  <div className="bg-white border border-gray-200 rounded-xl p-1.5 sm:p-2">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1">
                      <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                      <h4 className="font-semibold text-gray-800 text-xs sm:text-sm">Observações</h4>
                    </div>
                    <p className="text-gray-700 text-xs sm:text-sm">{orderDetails.notes}</p>
                  </div>
                )}
              </div>              {/* Avaliação */}
              {orderDetails.rating && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-1.5 sm:p-2">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />
                    <h4 className="font-semibold text-yellow-800 text-xs sm:text-sm">Sua Avaliação</h4>
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${i < orderDetails.rating! ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="ml-1 sm:ml-2 font-medium text-gray-700 text-xs sm:text-sm">
                      {orderDetails.rating}/5
                    </span>
                  </div>
                  {orderDetails.rating_comment && (
                    <p className="text-gray-700 text-xs sm:text-sm mt-1 italic">
                      "{orderDetails.rating_comment}"
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>        {/* Footer do Modal */}
        <div className="border-t border-gray-200 p-2 sm:p-3 flex-shrink-0">
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="px-4 sm:px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm"
            >
              Fechar
            </button>
            {orderDetails && 
             (orderDetails.status === 'done' || orderDetails.status === 'completed') && 
             !orderDetails.rating && 
             onRateProvider && (
              <button
                onClick={() => {
                  onRateProvider(orderId);
                  onClose();
                }}
                className="px-4 sm:px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium text-sm flex items-center gap-2"
              >
                <Star className="w-4 h-4" />
                Avaliar Prestador
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
