import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBarra from './components/NavBarra';
import Footer from './components/Footer';
import CadastroMultiStep from './pages/CadastroMultiStep';
import PaginaInicial from './pages/PaginaInicial';
import DashboardUser from './pages/Usuario/DashboardUser';
import DashboardPrestador from './pages/PrestadorServico/DashboardPrestador';
import Login from './components/Login';
import PerfilUsuario from './pages/PerfilUsuario';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardADM from './pages/Admin/DashboardADM';
import './App.css';
import PerfilUsuarioComum from './components/PerfilUsuarioComum';
import PerfilPrestador from './components/PerfilPrestador';
import PerfilPublicoPrestador from './pages/PrestadorServico/PerfilPublicoPrestador';

function App() {
  return (
    <Router>
      <div className="app-container">
        <NavBarra />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<PaginaInicial />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<CadastroMultiStep />} />
            <Route path="/providers/:id" element={<PerfilPublicoPrestador />} />
            <Route path="/usuario/perfil" element={
  <ProtectedRoute tipoPermitido="client">
    <PerfilUsuarioComum />
  </ProtectedRoute>
} />
<Route path="/prestador/perfil" element={
  <ProtectedRoute tipoPermitido="provider">
    <PerfilPrestador />
  </ProtectedRoute>
} />
            <Route path="/admin/perfil" element={
  <ProtectedRoute tipoPermitido="admin">
    <PerfilUsuario />
  </ProtectedRoute>
} />
            
            <Route path="/admin/dashboard" element={
  <ProtectedRoute tipoPermitido="admin">
    <DashboardADM />
  </ProtectedRoute>
} />
            <Route path="/usuario/dashboard" element={
              <ProtectedRoute tipoPermitido="client">
                <DashboardUser />
              </ProtectedRoute>
            } />
            <Route path="/prestador/dashboard" element={
              <ProtectedRoute tipoPermitido="provider">
                <DashboardPrestador />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;