// Exemplo de como usar o sistema Prompt Alerts em diferentes situações

import { usePromptAlerts } from '../components/UI/AlertContainer';

export function ExemplosDeUso() {
  const alerts = usePromptAlerts();

  // 1. Alert de sucesso simples
  const handleSuccess = () => {
    alerts.success('Operação realizada com sucesso!');
  };

  // 2. Alert de erro com título
  const handleError = () => {
    alerts.error('Não foi possível salvar os dados', 'Erro de conexão');
  };

  // 3. Alert de aviso com duração personalizada (10 segundos)
  const handleWarning = () => {
    alerts.warning('Seu token expira em 5 minutos', 'Atenção', 10000);
  };

  // 4. Alert de informação
  const handleInfo = () => {
    alerts.info('Nova atualização disponível', 'Sistema');
  };

  // 5. Alert personalizado com ações
  const handleCustomAlert = () => {
    alerts.custom({
      type: 'warning',
      title: 'Confirmação necessária',
      message: 'Deseja realmente excluir este item?',
      duration: 0, // Não remove automaticamente
      actions: [
        {
          label: 'Excluir',
          action: () => {
            console.log('Item excluído!');
            alerts.success('Item excluído com sucesso!');
          },
          variant: 'primary'
        },
        {
          label: 'Cancelar',
          action: () => {
            console.log('Ação cancelada');
          },
          variant: 'secondary'
        }
      ]
    });
  };

  // Exemplo de integração com API
  const handleApiCall = async () => {
    try {
      // Simula uma chamada de API
      const response = await fetch('/api/data');
      
      if (!response.ok) {
        throw new Error('Erro na API');
      }
      
      alerts.success('Dados carregados com sucesso!');
    } catch (error) {
      alerts.error('Erro ao carregar dados', 'Falha na API');
    }
  };

  return {
    handleSuccess,
    handleError,
    handleWarning,
    handleInfo,
    handleCustomAlert,
    handleApiCall
  };
}

// Exemplos de uso em diferentes contextos:

// 1. Em formulários de cadastro/login
export function ExemploFormulario() {
  const alerts = usePromptAlerts();

  const handleLogin = async (credentials: any) => {
    try {
      // Simula chamada de login
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      if (!response.ok) throw new Error('Login falhou');
      
      const data = await response.json();
      alerts.success(`Bem-vindo, ${data.user.name}!`, 'Login realizado');
    } catch (error) {
      alerts.error('Credenciais inválidas', 'Erro de autenticação');
    }
  };

  return { handleLogin };
}

// 2. Em operações CRUD
export function ExemploCRUD() {
  const alerts = usePromptAlerts();

  const createService = async (serviceData: any) => {
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData)
      });
      
      if (!response.ok) throw new Error('Erro ao criar serviço');
      
      alerts.success('Serviço criado com sucesso!', 'Sucesso');
    } catch (error) {
      alerts.error('Erro ao criar serviço', 'Falha na operação');
    }
  };

  const updateService = async (id: string, data: any) => {
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error('Erro ao atualizar');
      
      alerts.success('Serviço atualizado!');
    } catch (error) {
      alerts.error('Erro ao atualizar serviço');
    }
  };

  const deleteService = async (id: string) => {
    // Alert de confirmação
    alerts.custom({
      type: 'warning',
      title: 'Confirmar exclusão',
      message: 'Esta ação não pode ser desfeita',
      duration: 0,
      actions: [
        {
          label: 'Excluir',
          action: async () => {
            try {
              const response = await fetch(`/api/services/${id}`, {
                method: 'DELETE'
              });
              
              if (!response.ok) throw new Error('Erro ao excluir');
              
              alerts.success('Serviço excluído!');
            } catch (error) {
              alerts.error('Erro ao excluir serviço');
            }
          },
          variant: 'primary'
        },
        {
          label: 'Cancelar',
          action: () => {},
          variant: 'secondary'
        }
      ]
    });
  };

  return { createService, updateService, deleteService };
}

// 3. Para notificações do sistema
export function ExemploNotificacoes() {
  const alerts = usePromptAlerts();

  // Notificação de novo pedido
  const handleNewOrder = (order: any) => {
    alerts.info(`Novo pedido recebido: ${order.serviceName}`, 'Novo Pedido', 8000);
  };

  // Notificação de status
  const handleStatusChange = (status: string) => {
    const messages = {
      approved: { type: 'success', message: 'Seu perfil foi aprovado!' },
      rejected: { type: 'error', message: 'Seu perfil foi rejeitado' },
      pending: { type: 'warning', message: 'Seu perfil está em análise' }
    };
    
    const config = messages[status as keyof typeof messages];
    if (config) {
      alerts[config.type as 'success' | 'error' | 'warning'](config.message, 'Status do Perfil');
    }
  };

  return { handleNewOrder, handleStatusChange };
}

// Configuração para integrar com a API do professor
// No App.tsx, você pode configurar assim:
/*
<AlertProvider apiUrl="https://api-do-professor.com/prompt-alerts">
  <AppContent />
  <AlertContainer />
</AlertProvider>
*/
