import React from 'react';
import { Users, FileText, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../UI/Card';

export function QuickActions() {
  const actions = [
    {
      icon: Users,
      title: 'Gerenciar Usuários',
      description: 'Ver todos os usuários do sistema',
      color: 'blue'
    },
    {
      icon: FileText,
      title: 'Relatórios',
      description: 'Gerar relatórios do sistema',
      color: 'green'
    },
    {
      icon: Shield,
      title: 'Configurações',
      description: 'Configurar parâmetros do sistema',
      color: 'yellow'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-50 hover:bg-green-100 border-green-200 text-green-600';
      case 'yellow':
        return 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200 text-yellow-600';
      default:
        return 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900">Ações Rápidas</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.title}
                className={`border rounded-lg p-4 text-left transition-colors ${getColorClasses(action.color)}`}
              >
                <Icon className="h-6 w-6 mb-2" />
                <h3 className="font-medium text-gray-900">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}