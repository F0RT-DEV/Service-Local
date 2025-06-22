
import { Card, CardContent, CardHeader } from '../UI/Card';

interface SpecialtyOption {
  id: string;
  name: string;
}

interface SpecialtiesSectionProps {
  specialties: string[]; // IDs das categorias
  setSpecialties: (specialties: string[]) => void;
  isEditing: boolean;
  specialtyOptions: SpecialtyOption[];
}

export function SpecialtiesSection({ specialties, setSpecialties, isEditing, specialtyOptions }: SpecialtiesSectionProps) {
  const handleSpecialtyToggle = (id: string) => {
    if (specialties.includes(id)) {
      setSpecialties(specialties.filter(s => s !== id));
    } else {
      setSpecialties([...specialties, id]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900">Especialidades</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {specialtyOptions.map((option) => (
            <label key={option.id} className="relative flex items-center">
              <input
                type="checkbox"
                checked={specialties.includes(option.id)}
                onChange={() => handleSpecialtyToggle(option.id)}
                disabled={!isEditing}
                className="sr-only"
              />
              <div className={`border-2 rounded-lg p-3 cursor-pointer transition-colors text-center ${
                specialties.includes(option.id)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              } ${!isEditing ? 'cursor-not-allowed opacity-60' : ''}`}>
                <span className="text-sm font-medium">{option.name}</span>
              </div>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}