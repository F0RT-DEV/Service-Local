

interface ProviderDetails {
  id: string;
  name: string;
  bio?: string;
  specialties?: string[];
  cnpj?: string;
  status?: string;
  requestDate?: string;
  email?: string;
}

interface ProviderDetailsModalProps {
  provider: ProviderDetails;
  onClose: () => void;
}

export function ProviderDetailsModal({ provider, onClose }: ProviderDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Fechar"
        >
          &times;
        </button>
        <div className="flex flex-col items-center mb-4">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2">
            <span className="text-3xl text-gray-400">{provider.name[0]}</span>
          </div>
          <h3 className="text-lg font-semibold">{provider.name}</h3>
          <span className="text-xs text-gray-500 capitalize">{provider.status}</span>
        </div>
        <div className="space-y-1 text-sm">
          {provider.bio && <p><strong>Bio:</strong> {provider.bio}</p>}
          {provider.cnpj && <p><strong>CNPJ:</strong> {provider.cnpj}</p>}
          {provider.specialties && provider.specialties.length > 0 && (
            <p><strong>Especialidades:</strong> {provider.specialties.join(', ')}</p>
          )}
          {provider.requestDate && (
            <p>
              <strong>Solicitado em:</strong>{" "}
              {new Date(provider.requestDate).toLocaleString("pt-BR")}
            </p>
          )}
          {provider.email && <p><strong>Email:</strong> {provider.email}</p>}
        </div>
      </div>
    </div>
  );
}