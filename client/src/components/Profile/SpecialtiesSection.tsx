import React from 'react';
import { Card, CardContent, CardHeader } from '../UI/Card';

interface SpecialtiesSectionProps {
  specialties: string[];
  setSpecialties: (specialties: string[]) => void;
  isEditing: boolean;
}

export function SpecialtiesSection({ specialties, setSpecialties, isEditing }: SpecialtiesSectionProps) {
  const specialtyOptions = [
    'Elétrica', 'Hidráulica', 'Limpeza', 'Jardinagem', 
    'Pintura', 'Marcenaria', 'Reforma', 'Ar Condicionado'
  ];

  const handleSpecialtyToggle = (specialty: string) => {
    if (specialties.includes(specialty)) {
      setSpecialties(specialties.filter(s => s !== specialty));
    } else {
      setSpecialties([...specialties, specialty]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900">Especialidades</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {specialtyOptions.map((specialty) => (
            <label key={specialty} className="relative flex items-center">
              <input
                type="checkbox"
                checked={specialties.includes(specialty)}
                onChange={() => handleSpecialtyToggle(specialty)}
                disabled={!isEditing}
                className="sr-only"
              />
              <div className={`border-2 rounded-lg p-3 cursor-pointer transition-colors text-center ${
                specialties.includes(specialty)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              } ${!isEditing ? 'cursor-not-allowed opacity-60' : ''}`}>
                <span className="text-sm font-medium">{specialty}</span>
              </div>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}