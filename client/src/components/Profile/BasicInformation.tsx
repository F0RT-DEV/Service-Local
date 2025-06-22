
import { User, Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../UI/Card';
import { FormInput } from '../UI/FormInput';
import { FormTextarea } from '../UI/FormTextarea';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
}

interface BasicInformationProps {
  profileData: ProfileData;
  setProfileData: (data: ProfileData) => void;
  isEditing: boolean;
}

export function BasicInformation({ profileData, setProfileData, isEditing }: BasicInformationProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900">Informações Básicas</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Nome Completo"
            value={profileData.name}
            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
            icon={User}
            disabled={!isEditing}
            required
          />

          <FormInput
            label="Email"
            type="email"
            value={profileData.email}
            onChange={() => {}}
            icon={Mail}
            disabled
          />

          <FormInput
            label="Telefone"
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
            placeholder="(11) 99999-9999"
            icon={Phone}
            disabled={!isEditing}
          />

          <FormInput
            label="Endereço"
            value={profileData.address}
            onChange={(e) => setProfileData({...profileData, address: e.target.value})}
            placeholder="Rua, número, bairro, cidade"
            icon={MapPin}
            disabled={!isEditing}
          />
        </div>

        <div className="mt-4">
          <FormTextarea
            label="Descrição Profissional"
            value={profileData.description}
            onChange={(e) => setProfileData({...profileData, description: e.target.value})}
            placeholder="Descreva sua experiência e serviços oferecidos..."
            disabled={!isEditing}
          />
        </div>
      </CardContent>
    </Card>
  );
}