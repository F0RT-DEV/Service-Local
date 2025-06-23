import { createContext, useContext, useState, ReactNode } from 'react';

export interface Alert {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number; // em milissegundos, 0 = não remove automaticamente
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: 'primary' | 'secondary';
  }>;
}

interface AlertContextType {
  alerts: Alert[];
  showAlert: (alert: Omit<Alert, 'id'>) => string;
  removeAlert: (id: string) => void;
  clearAlerts: () => void;
  // Métodos de conveniência
  showSuccess: (message: string, title?: string, duration?: number) => string;
  showError: (message: string, title?: string, duration?: number) => string;
  showWarning: (message: string, title?: string, duration?: number) => string;
  showInfo: (message: string, title?: string, duration?: number) => string;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertProviderProps {
  children: ReactNode;
  apiUrl?: string; // URL da API do professor, se necessário
}

export function AlertProvider({ children, apiUrl }: AlertProviderProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const showAlert = (alertData: Omit<Alert, 'id'>): string => {
    const id = generateId();
    const newAlert: Alert = {
      ...alertData,
      id,
      duration: alertData.duration ?? 5000, // 5 segundos por padrão
    };

    setAlerts(prev => [...prev, newAlert]);

    // Auto remove alert se duration > 0
    if (newAlert.duration && newAlert.duration > 0) {
      setTimeout(() => {
        removeAlert(id);
      }, newAlert.duration);
    }

    // Se você quiser integrar com a API do professor, faça aqui
    if (apiUrl) {
      sendToPromptAlerts(newAlert);
    }

    return id;
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  // Métodos de conveniência
  const showSuccess = (message: string, title?: string, duration?: number) =>
    showAlert({ type: 'success', message, title, duration });

  const showError = (message: string, title?: string, duration?: number) =>
    showAlert({ type: 'error', message, title, duration });

  const showWarning = (message: string, title?: string, duration?: number) =>
    showAlert({ type: 'warning', message, title, duration });

  const showInfo = (message: string, title?: string, duration?: number) =>
    showAlert({ type: 'info', message, title, duration });
  // Função para enviar para a API do professor (se necessário)
  const sendToPromptAlerts = async (alert: Alert) => {
    if (!apiUrl) return;
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Se precisar de auth
        },
        body: JSON.stringify({
          type: alert.type,
          title: alert.title || '',
          message: alert.message,
          timestamp: new Date().toISOString(),
          userId: localStorage.getItem('userId'), // Se precisar identificar o usuário
          source: 'service-local-app', // Identificar a origem
        }),
      });
      
      if (!response.ok) {
        console.warn('Falha ao enviar alert para Prompt Alerts API:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao enviar alert para Prompt Alerts:', error);
    }
  };

  const value: AlertContextType = {
    alerts,
    showAlert,
    removeAlert,
    clearAlerts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert deve ser usado dentro de um AlertProvider');
  }
  return context;
}
