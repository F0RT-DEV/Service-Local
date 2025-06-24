import { Eye, Check, X, User } from 'lucide-react';
import { Card } from '../UI/Card';
import { ActionButton } from '../UI/ActionButton';
import { StatusBadge } from '../UI/StatusBadge';

interface PendingProvider {
  id: string;
  name: string;
  email: string; // Aqui está vindo a bio
  specialties: string[];
  documents: string;
  requestDate: string;
  cnpj?: string;
  avatar?: string; // Adicione se for possível trazer do backend
}

interface PendingProviderCardProps {
  provider: PendingProvider;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewProfile: (id: string) => void;
}

export function PendingProviderCard({ 
  provider, 
  onApprove, 
  onReject, 
  onViewProfile 
}: PendingProviderCardProps) {
  return (
    <Card hover className="p-3 sm:p-5 rounded-xl border border-gray-200 shadow group transition-all hover:shadow-lg bg-white">
      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-3">
        {/* Avatar ou inicial */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center border-2 border-blue-200 shadow flex-shrink-0">
          <span className="text-lg sm:text-xl text-blue-700 font-bold">{provider.name[0]}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{provider.name}</h3>
            <StatusBadge 
              status={provider.documents}
              variant={provider.documents === 'Completos' ? 'success' : 'warning'}
            >
              Docs: {provider.documents}
            </StatusBadge>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500">
              <span className="font-medium text-gray-700">Bio:</span> {provider.email}
            </p>
            <p className="text-xs text-gray-500">
              <span className="font-medium text-gray-700">Especialidades:</span> {provider.specialties.join(', ') || 'Nenhuma'}
            </p>
            {provider.cnpj && (
              <p className="text-xs text-gray-500">
                <span className="font-medium text-gray-700">CNPJ:</span> {provider.cnpj}
              </p>
            )}
            <p className="text-xs text-gray-400">
              <span className="font-medium text-gray-600">Solicitado em:</span> {new Date(provider.requestDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-3">
        <ActionButton variant="success" icon={Check} onClick={() => onApprove(provider.id)}>
          Aprovar
        </ActionButton>
        <ActionButton variant="danger" icon={X} onClick={() => onReject(provider.id)}>
          Rejeitar
        </ActionButton>
        <ActionButton variant="secondary" icon={Eye} onClick={() => onViewProfile(provider.id)}>
          Ver Perfil
        </ActionButton>
      </div>
    </Card>
  );
}