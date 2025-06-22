import { Upload } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../UI/Card';
import { FormInput } from '../UI/FormInput';

interface Documents {
  cpf: string;
  rg: string;
  certificates: string[];
}

interface DocumentsSectionProps {
  documents: Documents;
  setDocuments: (documents: Documents) => void;
  isEditing: boolean;
}

export function DocumentsSection({ documents, setDocuments, isEditing }: DocumentsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900">Documentos</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <FormInput
            label="CPF"
            value={documents.cpf}
            onChange={(e) => setDocuments({...documents, cpf: e.target.value})}
            placeholder="000.000.000-00"
            disabled={!isEditing}
          />

          <FormInput
            label="RG"
            value={documents.rg}
            onChange={(e) => setDocuments({...documents, rg: e.target.value})}
            placeholder="00.000.000-0"
            disabled={!isEditing}
          />

          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Certificados (opcional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Clique para enviar ou arraste arquivos aqui
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, PDF até 10MB</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}