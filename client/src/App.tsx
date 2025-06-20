import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { ClientDashboard } from './components/Dashboard/ClientDashboard';
import { ProviderDashboard } from './components/Dashboard/ProviderDashboard';
import { AdminDashboard } from './components/Dashboard/AdminDashboard';
import { ServiceSearch } from './components/Services/ServiceSearch';
import { ProviderProfile } from './components/Profile/ProviderProfile';

function AppContent() {
  const { user } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [currentView, setCurrentView] = useState('dashboard');

  if (!user) {
    return authView === 'login' ? (
      <LoginForm onSwitchToRegister={() => setAuthView('register')} />
    ) : (
      <RegisterForm onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        switch (user.role) {
          case 'admin':
            return <AdminDashboard />;
          case 'provider':
            return <ProviderDashboard />;
          case 'client':
            return <ClientDashboard />;
          default:
            return <div>Dashboard não encontrado</div>;
        }
      case 'search':
        return <ServiceSearch />;
      case 'profile':
        return user.role === 'provider' ? <ProviderProfile /> : <div>Perfil do Cliente</div>;
      case 'services':
        return <div>Gerenciar Serviços</div>;
      case 'orders':
        return <div>Gerenciar Ordens</div>;
      case 'providers':
        return <div>Gerenciar Providers (Admin)</div>;
      case 'calendar':
        return <div>Agenda</div>;
      default:
        return <div>Página não encontrada</div>;
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {renderCurrentView()}
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;