
import { Users, BarChart2, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../UI/Card';

interface QuickActionsProps {
  onManageUsers: () => void;
  onServiceSettings: () => void;
  onStatistics: () => void;
}

export function QuickActions({ onManageUsers, onServiceSettings, onStatistics }: QuickActionsProps) {
  const actions = [
    {
      icon: Users,
      title: 'Gerenciar Usuários',
      description: 'Ver todos os usuários do sistema',
      color: 'blue',
      onClick: onManageUsers,
    },
    {
        icon: Shield,
      title: 'Configurações de Serviços',
      description: 'Configurar parâmetros para serviços',
      color: 'yellow',
      onClick: onServiceSettings,
    },
    // {
    //   icon: BarChart2,
    //   title: 'Estatísticas',
    //   description: 'Estatísticas do sistema',
    //   color: 'green',
    //   onClick: onStatistics,
    // }
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
        <div className="flex flex-col gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.title}
                className={`border rounded-lg p-4 text-left transition-colors ${getColorClasses(action.color)}`}
                onClick={action.onClick}
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