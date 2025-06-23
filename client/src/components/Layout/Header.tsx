import { useState } from "react";
import { User, LogOut, Bell } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

// Cabeçalho do sistema com efeito de clique no ícone de notificações.
export function Header() {
  const { user, logout } = useAuth();
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(false);

  const toggleNotificacoes = () => {
    setNotificacoesAtivas((prev) => !prev);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800 tracking-tight">
              Auxtech
            </h1>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleNotificacoes}
                className={`p-2 transition-colors rounded-full ${
                  notificacoesAtivas
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-400 hover:text-gray-500"
                }`}
                title="Notificações"
              >
                <Bell className="h-5 w-5" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-gray-500 transition-colors"
                  title="Sair"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
