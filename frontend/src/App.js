import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AutenticacaoProvider, useAuth } from './context/AutenticacaoLocal';
import NavBarra from './components/NavBarra';
import Footer from './components/Footer';
import CadastroMultiStep from './pages/CadastroMultiStep';
import PaginaInicial from './pages/PaginaInicial';
import CardsCadastros from './pages/CardsCadastros'; // Importe o novo componente
import './App.css';

// Componente de rota protegida
const ProtectedRoute = ({ children, tipoPermitido }) => {
  const { estaAutenticado, getUsuario, carregando } = useAuth();
  
  if (carregando) {
    return <div className="loading">Carregando...</div>;
  }
  
  if (!estaAutenticado()) {
    return <Navigate to="/" replace />;
  }
  
  const usuario = getUsuario();
  
  if (tipoPermitido && usuario.tipo !== tipoPermitido) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Componentes simulados para as páginas de dashboard
const DashboardUsuario = () => (
  <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Dashboard do Usuário</h1>
    <p>Bem-vindo à sua área do usuário!</p>
    {/* Adicione um link para a página de cards no dashboard */}
    <a href="/cards" className="text-blue-600 hover:underline">
      Ver todos os cadastros
    </a>
  </div>
);

const DashboardPrestador = () => (
  <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Dashboard do Prestador</h1>
    <p>Bem-vindo à sua área de prestador de serviços!</p>
    {/* Adicione um link para a página de cards no dashboard */}
    <a href="/cards" className="text-blue-600 hover:underline">
      Ver todos os cadastros
    </a>
  </div>
);

function App() {
  return (
    <AutenticacaoProvider>
      <Router>
        <div className="app-container">
          <NavBarra />
          
          <main className="app-content">
            <Routes>
              <Route path="/" element={<PaginaInicial />} />
              <Route path="/cadastro" element={<CadastroMultiStep />} />
              
              {/* Novas rotas para os cards */}
              <Route 
                path="/cards" 
                element={
                  <ProtectedRoute>
                    <CardsCadastros />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/detalhes/:email" 
                element={
                  <ProtectedRoute>
                    <CardsCadastros />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/usuario/dashboard" 
                element={
                  <ProtectedRoute tipoPermitido="usuario">
                    <DashboardUsuario />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/prestador/dashboard" 
                element={
                  <ProtectedRoute tipoPermitido="prestador">
                    <DashboardPrestador />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </AutenticacaoProvider>
  );
}

export default App;