import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { useAlert, Alert } from '../../contexts/AlertContext';

interface AlertItemProps {
  alert: Alert;
  onClose: (id: string) => void;
}

function AlertItem({ alert, onClose }: AlertItemProps) {
  const getAlertStyles = (type: Alert['type']) => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-50 border-green-200 text-green-800',
          icon: <CheckCircle className="h-5 w-5 text-green-400" />,
          button: 'text-green-400 hover:text-green-600'
        };
      case 'error':
        return {
          container: 'bg-red-50 border-red-200 text-red-800',
          icon: <XCircle className="h-5 w-5 text-red-400" />,
          button: 'text-red-400 hover:text-red-600'
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          icon: <AlertTriangle className="h-5 w-5 text-yellow-400" />,
          button: 'text-yellow-400 hover:text-yellow-600'
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200 text-blue-800',
          icon: <Info className="h-5 w-5 text-blue-400" />,
          button: 'text-blue-400 hover:text-blue-600'
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-200 text-gray-800',
          icon: <Info className="h-5 w-5 text-gray-400" />,
          button: 'text-gray-400 hover:text-gray-600'
        };
    }
  };

  const styles = getAlertStyles(alert.type);

  return (
    <div className={`border rounded-lg p-4 shadow-lg ${styles.container} animate-slide-in`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {styles.icon}
        </div>
        <div className="ml-3 flex-1">
          {alert.title && (
            <h3 className="text-sm font-medium mb-1">
              {alert.title}
            </h3>
          )}
          <p className="text-sm">
            {alert.message}
          </p>
          {alert.actions && alert.actions.length > 0 && (
            <div className="mt-3 flex gap-2">
              {alert.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    action.action();
                    onClose(alert.id);
                  }}
                  className={`text-xs px-3 py-1 rounded font-medium ${
                    action.variant === 'primary'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={() => onClose(alert.id)}
            className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.button}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function AlertContainer() {
  const { alerts, removeAlert } = useAlert();

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {alerts.map((alert) => (
        <AlertItem
          key={alert.id}
          alert={alert}
          onClose={removeAlert}
        />
      ))}
    </div>
  );
}

// Hook personalizado para facilitar o uso
export function usePromptAlerts() {
  const { showSuccess, showError, showWarning, showInfo, showAlert } = useAlert();

  return {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
    custom: showAlert,
  };
}
