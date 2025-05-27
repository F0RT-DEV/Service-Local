import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AutenticacaoLocal';
import DashboardUser from './pages/Usuario/DashboardUser';
import DashboardADM from './pages/Admin/DashboardADM';
import DashboardPrestador from './pages/PrestadorServico/DashboardPrestador';
import Login from './pages/PrestadorServico/Login';
import Cadastro from './pages/PrestadorServico/Cadastro';
import PaginaRegistro from './pages/PrestadorServico/PaginaRegistro';
import CadastroUsuario from './pages/Usuario/CadastroUsuario';
import CadastroPrestador from './pages/PrestadorServico/CadastroPrestador';
import CadastroADM from './pages/Admin/CadastroADM';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/registro" element={<PaginaRegistro />} />
          <Route path="/usuario/dashboard" element={<DashboardUser />} />
          <Route path="/admin/dashboard" element={<DashboardADM />} />
          <Route path="/prestador/dashboard" element={<DashboardPrestador />} />
          <Route path="/cadastro/Usuario" element={<CadastroUsuario />} />
          <Route path="/cadastro/prestador" element={<CadastroPrestador />} />
          <Route path="/cadastro/admin" element={<CadastroADM />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
