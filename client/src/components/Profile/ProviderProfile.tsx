import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { ActionButton } from '../UI/ActionButton';
import { BasicInformation } from './BasicInformation';
import { SpecialtiesSection } from './SpecialtiesSection';
import { DocumentsSection } from './DocumentsSection';
import { ProfileSidebar } from './ProfileSidebar';

export function ProviderProfile() {
  const [profileData, setProfileData] = useState({
    name: 'Maria Prestadora',
    email: 'provider@email.com',
    phone: '',
    address: '',
    description: ''
  });

  const [specialties, setSpecialties] = useState<string[]>([]);
  const [documents, setDocuments] = useState({
    cpf: '',
    rg: '',
    certificates: [] as string[]
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    console.log('Saving profile:', { profileData, specialties, documents });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600">Complete seu perfil para receber aprovação</p>
        </div>
        {!isEditing ? (
          <ActionButton onClick={() => setIsEditing(true)}>
            Editar Perfil
          </ActionButton>
        ) : (
          <div className="flex space-x-2">
            <ActionButton variant="success" onClick={handleSave}>
              Salvar
            </ActionButton>
            <ActionButton variant="secondary" onClick={() => setIsEditing(false)}>
              Cancelar
            </ActionButton>
          </div>
        )}
      </div>

      {/* Profile Status */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
              <FileText className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Status: Aguardando Aprovação
            </h3>
            <p className="text-sm text-yellow-700">
              Complete todas as informações para acelerar o processo de aprovação.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          <BasicInformation
            profileData={profileData}
            setProfileData={setProfileData}
            isEditing={isEditing}
          />

          <SpecialtiesSection
            specialties={specialties}
            setSpecialties={setSpecialties}
            isEditing={isEditing}
          />

          <DocumentsSection
            documents={documents}
            setDocuments={setDocuments}
            isEditing={isEditing}
          />
        </div>

        {/* Sidebar */}
        <ProfileSidebar isEditing={isEditing} />
      </div>
    </div>
  );
}