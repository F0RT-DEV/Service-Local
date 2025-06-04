import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AutenticacaoProvider, useAuth } from './context/AutenticacaoLocal';
import NavBarra from './components/NavBarra';
import Footer from './components/Footer';
import CadastroMultiStep from './pages/CadastroMultiStep';
import PaginaInicial from './pages/PaginaInicial';
import DashboardUser from './pages/Usuario/DashboardUser';
import DashboardPrestador from './pages/PrestadorServico/DashboardPrestador';
import Login from './components/Login';
import PerfilUsuario from './pages/PerfilUsuario';
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

function App() {
  return (
    <AutenticacaoProvider>
      <Router>
        <div className="app-container">
          <NavBarra />
          
          <main className="app-content">
            <Routes>
              <Route path="/" element={<PaginaInicial />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<CadastroMultiStep />} />
              <Route path="/usuario/perfil" element={<ProtectedRoute tipoPermitido="usuario"><PerfilUsuario /></ProtectedRoute>} />
              {/* Dashboard do Usuário Comum */}
              <Route 
                path="/usuario/dashboard" 
                element={
                  <ProtectedRoute tipoPermitido="usuario">
                    <DashboardUser />
                  </ProtectedRoute>
                } 
              />

              {/* Dashboard do Prestador */}
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