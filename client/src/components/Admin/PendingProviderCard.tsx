import { Eye, Check, X } from 'lucide-react';
import { Card } from '../UI/Card';
import { ActionButton } from '../UI/ActionButton';
import { StatusBadge } from '../UI/StatusBadge';

interface PendingProvider {
  id: string;
  name: string;
  email: string;
  specialties: string[];
  documents: string;
  requestDate: string;
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
    <Card hover className="p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-gray-900">{provider.name}</h3>
          <p className="text-sm text-gray-600">{provider.email}</p>
          <p className="text-sm text-gray-500">
            Especialidades: {provider.specialties.join(', ')}
          </p>
          <p className="text-sm text-gray-500">
            Solicitado em: {new Date(provider.requestDate).toLocaleDateString()}
          </p>
        </div>
        <StatusBadge 
          status={provider.documents}
          variant={provider.documents === 'Completos' ? 'success' : 'warning'}
        >
          Docs: {provider.documents}
        </StatusBadge>
      </div>
      <div className="flex space-x-2">
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