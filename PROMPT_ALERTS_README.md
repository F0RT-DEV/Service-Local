# Sistema Prompt Alerts

Sistema de notificações/alerts integrado para o projeto Service-Local, compatível com a API do professor.

## Instalação e Configuração

O sistema já está configurado no projeto. Os arquivos principais são:

- `src/contexts/AlertContext.tsx` - Contexto que gerencia os alerts
- `src/components/UI/AlertContainer.tsx` - Componente para exibir os alerts
- `src/examples/PromptAlertsExamples.tsx` - Exemplos de uso

## Como Usar

### 1. Import básico
```tsx
import { usePromptAlerts } from '../components/UI/AlertContainer';

function MeuComponente() {
  const alerts = usePromptAlerts();
  
  // Usar os métodos de alert
}
```

### 2. Tipos de Alert

#### Success (Sucesso)
```tsx
alerts.success('Operação realizada com sucesso!');
alerts.success('Dados salvos!', 'Sucesso', 3000); // Com título e duração
```

#### Error (Erro)
```tsx
alerts.error('Erro ao processar solicitação');
alerts.error('Falha na conexão', 'Erro de Rede');
```

#### Warning (Aviso)
```tsx
alerts.warning('Atenção: dados não salvos');
alerts.warning('Token expira em 5 minutos', 'Aviso');
```

#### Info (Informação)
```tsx
alerts.info('Nova atualização disponível');
alerts.info('Sistema será atualizado', 'Manutenção');
```

### 3. Alert Personalizado com Ações
```tsx
alerts.custom({
  type: 'warning',
  title: 'Confirmar ação',
  message: 'Deseja realmente excluir este item?',
  duration: 0, // 0 = não remove automaticamente
  actions: [
    {
      label: 'Confirmar',
      action: () => {
        // Lógica de confirmação
        alerts.success('Item excluído!');
      },
      variant: 'primary'
    },
    {
      label: 'Cancelar',
      action: () => {
        // Lógica de cancelamento
      },
      variant: 'secondary'
    }
  ]
});
```

## Exemplos Práticos

### Em Formulários
```tsx
const handleSubmit = async (data) => {
  try {
    await api.post('/endpoint', data);
    alerts.success('Dados salvos com sucesso!');
  } catch (error) {
    alerts.error('Erro ao salvar dados', 'Falha na operação');
  }
};
```

### Em Operações CRUD
```tsx
const deleteItem = (id) => {
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
            await api.delete(`/items/${id}`);
            alerts.success('Item excluído!');
          } catch (error) {
            alerts.error('Erro ao excluir item');
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
```

### Para Notificações do Sistema
```tsx
// Notificar sobre novos pedidos
const handleNewOrder = (order) => {
  alerts.info(`Novo pedido: ${order.serviceName}`, 'Novo Pedido', 8000);
};

// Notificar mudanças de status
const handleStatusChange = (status) => {
  switch(status) {
    case 'approved':
      alerts.success('Seu perfil foi aprovado!', 'Status Atualizado');
      break;
    case 'rejected':
      alerts.error('Seu perfil foi rejeitado', 'Status Atualizado');
      break;
    case 'pending':
      alerts.warning('Seu perfil está em análise', 'Status Atualizado');
      break;
  }
};
```

## Integração com API do Professor

Para integrar com a API "Prompt Alerts" do professor, configure a URL no App.tsx:

```tsx
<AlertProvider apiUrl="https://api-do-professor.com/prompt-alerts">
  <AppContent />
  <AlertContainer />
</AlertProvider>
```

Quando configurado, todos os alerts serão automaticamente enviados para a API do professor com o seguinte formato:

```json
{
  "type": "success|error|warning|info",
  "title": "Título do alert",
  "message": "Mensagem do alert",
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

## Parâmetros

### Alert Básico
- `message` (string): Mensagem principal
- `title` (string, opcional): Título do alert
- `duration` (number, opcional): Duração em ms (padrão: 5000, 0 = permanente)

### Alert Personalizado
- `type`: 'success' | 'error' | 'warning' | 'info'
- `title` (opcional): Título
- `message`: Mensagem principal
- `duration` (opcional): Duração em ms
- `actions` (opcional): Array de ações com botões

### Ações
- `label`: Texto do botão
- `action`: Função a ser executada
- `variant`: 'primary' | 'secondary' (estilo do botão)

## Estilos e Animações

Os alerts aparecem no canto superior direito da tela com:
- Animação de slide-in (da direita para esquerda)
- Cores específicas para cada tipo
- Ícones apropriados
- Botão de fechar
- Auto-close baseado na duração

## Onde Usar

- ✅ Confirmação de operações (salvar, excluir, etc.)
- ✅ Erros de validação
- ✅ Falhas de conexão/API
- ✅ Notificações do sistema
- ✅ Confirmações antes de ações críticas
- ✅ Feedback de sucesso em operações
- ✅ Avisos importantes para o usuário

O sistema está pronto para uso em qualquer componente do projeto!
