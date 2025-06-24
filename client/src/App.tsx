import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AlertProvider } from './contexts/AlertContext';
import { AlertContainer } from './components/UI/AlertContainer';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { ClientDashboard } from './components/Dashboard/ClientDashboard';
import { ProviderDashboard } from './components/Dashboard/ProviderDashboard';
import { AdminDashboard } from './components/Dashboard/AdminDashboard';
import { ProviderProfile } from './components/Profile/ProviderProfile';
import { MyOrders } from './components/Client/MyOrders';
import { OrderDetails } from './components/Client/OrderDetails';
import { ProfileEdit } from './components/Client/ProfileEdit';
import { MyProviderServices } from './components/Provider/MyProviderServices';
import { ServiceSearch } from './components/Services/ServiceSearch';
import { ProviderOrders } from './components/Provider/ProviderOrders';
import { PendingProvidersPage } from './components/Admin/PendingProvidersPage';
import { ServiceSettingsPage } from './components/Admin/ServiceSettingsPage';
import { ReportPage } from './components/Admin/ReportPage';
import { AdminOrdersPage } from './components/Admin/AdminOrdersPage';
import { UsersListPage } from './components/Admin/UsersListPage';
import PaginaInicial from './page/PaginaInicial';

function AppContent() {
  const { user } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showLanding, setShowLanding] = useState(!user);

  // Se não há usuário logado e ainda deve mostrar a landing page
  if (!user && showLanding) {
    return <PaginaInicial onNavigateToAuth={() => setShowLanding(false)} />;
  }

  // Se não há usuário logado e não deve mostrar landing, mostra auth
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
            return (
              <AdminDashboard
                onManageUsers={() => setCurrentView('users')}
                onServiceSettings={() => setCurrentView('service-settings')}
                onStatistics={() => setCurrentView('report')}
              />
            );
         case 'provider':
          return <ProviderDashboard setCurrentView={setCurrentView} />;
          case 'client':
            return <ClientDashboard />;
          default:
            return <div>Dashboard não encontrado</div>;
        }
      case 'search':
        return <ServiceSearch />;
      case 'my-provider-services':
        return <MyProviderServices />;
      case 'profile':
        return user.role === 'provider'
          ? <ProviderProfile />
          : <ProfileEdit />;
      case 'providers':
        return <PendingProvidersPage />;
      case 'service-settings':
        return <ServiceSettingsPage />;
      case 'report':
        return <ReportPage />;
      case 'users':
        return <UsersListPage />;
      case 'services':
        return <div>Gerenciar Serviços</div>;
      case 'orders':
        if (user.role === 'admin') {
          return <AdminOrdersPage />;
        }        if (user.role === 'client') {
          return selectedOrderId
            ? <OrderDetails orderId={selectedOrderId} onBack={() => setSelectedOrderId(null)} />
            : <MyOrders />;
        }
        if (user.role === 'provider') {
          return <ProviderOrders />;
        }
        return <div>Gerenciar Ordens</div>;
      case 'calendar':
        return <div>Agenda</div>;
      default:
        return <div>Página não encontrada</div>;
    }
  };  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          if (view !== 'orders') setSelectedOrderId(null);
        }}
      />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header />        <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
          <div className="max-w-7xl mx-auto py-2 sm:py-3 px-2 sm:px-4 lg:px-8">
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
      <AlertProvider>
        <AppContent />
        <AlertContainer />
      </AlertProvider>
    </AuthProvider>
  );
}

export default App;