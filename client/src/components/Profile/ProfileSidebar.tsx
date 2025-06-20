import React from 'react';
import { User, Star } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../UI/Card';
import { ActionButton } from '../UI/ActionButton';

interface ProfileSidebarProps {
  isEditing: boolean;
}

export function ProfileSidebar({ isEditing }: ProfileSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Foto do Perfil</h3>
        </CardHeader>
        <CardContent className="text-center">
          <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="w-16 h-16 text-gray-400" />
          </div>
          {isEditing && (
            <ActionButton>
              Alterar Foto
            </ActionButton>
          )}
        </CardContent>
      </Card>

      {/* Profile Completion */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Completude do Perfil</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span>65%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '65%'}}></div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                Informações básicas
              </div>
              <div className="flex items-center text-yellow-600">
                <div className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></div>
                Especialidades
              </div>
              <div className="flex items-center text-gray-400">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                Documentos
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Avaliações</h3>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-3xl font-bold text-gray-900">4.8</div>
          <div className="flex justify-center mt-1">
            {[1,2,3,4,5].map((star) => (
              <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">Baseado em 24 avaliações</p>
        </CardContent>
      </Card>
    </div>
  );
}