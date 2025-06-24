import { Mail, Briefcase, Calendar, Badge } from 'lucide-react';

interface ProviderDetails {
  id: string;
  name: string;
  bio?: string;
  specialties?: string[];
  cnpj?: string;
  status?: string;
  requestDate?: string;
  email?: string;
  avatar?: string;
}

interface ProviderDetailsModalProps {
  provider: ProviderDetails;
  onClose: () => void;
}

export function ProviderDetailsModal({ provider, onClose }: ProviderDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start sm:items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl p-3 sm:p-8 shadow-2xl max-w-md w-full mx-auto relative animate-fade-in max-h-[95vh] overflow-y-auto mt-4 sm:mt-0">
        <button
          className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-400 hover:text-red-500 text-xl sm:text-2xl transition-colors p-1"
          onClick={onClose}
          aria-label="Fechar"
        >
          &times;
        </button>
        <div className="flex flex-col items-center mb-3 sm:mb-6 pt-6 sm:pt-0">
          {provider.avatar ? (
            <img
              src={
                provider.avatar.startsWith('http')
                  ? provider.avatar
                  : `http://localhost:3333${provider.avatar}`
              }
              alt={provider.name}
              className="w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-blue-200 shadow mb-2"
            />
          ) : (
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center mb-2 border-4 border-blue-200 shadow">
              <span className="text-2xl sm:text-4xl text-blue-700 font-bold">{provider.name[0]}</span>
            </div>
          )}
          <h3 className="text-base sm:text-xl font-semibold text-gray-900 text-center">{provider.name}</h3>
          <span className="text-xs text-gray-500 capitalize mt-1">
            {provider.status || 'Pendente'}
          </span>
        </div>
        <div className="space-y-3 text-xs sm:text-sm">
          {provider.bio && (
            <div className="flex items-start gap-2 text-gray-700">
              <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <span><span className="font-semibold">Bio:</span> {provider.bio}</span>
            </div>
          )}
          {provider.cnpj && (
            <div className="flex items-center gap-2 text-gray-700">
              <Badge className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
              <span><span className="font-semibold">CNPJ:</span> {provider.cnpj}</span>
            </div>
          )}
          {provider.specialties && provider.specialties.length > 0 && (
            <div className="flex items-start gap-2 text-gray-700">
              <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 mt-0.5 flex-shrink-0" />
              <span>
                <span className="font-semibold">Especialidades:</span> {provider.specialties.join(', ')}
              </span>
            </div>
          )}
          {provider.requestDate && (
            <div className="flex items-start gap-2 text-gray-700">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <span>
                <span className="font-semibold">Solicitado em:</span>{" "}
                {new Date(provider.requestDate).toLocaleString("pt-BR")}
              </span>
            </div>
          )}
          {provider.email && (
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
              <span className="break-all"><span className="font-semibold">Email:</span> {provider.email}</span>
            </div>
          )}
        </div>
      </div>
      <style>
        {`
          .animate-fade-in {
            animation: fadeInModal .3s;
          }          @keyframes fadeInModal {
            from { opacity: 0; transform: translateY(40px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
}