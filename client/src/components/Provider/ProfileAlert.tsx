import { AlertCircle } from 'lucide-react';

export function ProfileAlert({ onCompleteProfile }: { onCompleteProfile?: () => void }) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Perfil Pendente de Aprovação
          </h3>
          <p className="text-sm text-yellow-700 mt-1">
            Seu perfil está sendo analisado pela equipe. Complete todas as informações para acelerar o processo.
          </p>
          <button
            className="mt-2 text-sm font-medium text-yellow-800 hover:text-yellow-600"
            onClick={onCompleteProfile}
          >
            Completar perfil →
          </button>
        </div>
      </div>
    </div>
  );
}