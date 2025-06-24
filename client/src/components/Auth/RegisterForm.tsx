import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Phone, MapPin, Hash } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePromptAlerts } from '../UI/AlertContainer';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client' as 'client' | 'provider',
    cpf: '',
    phone: '',
    cep: '',
    logradouro: '',
    complemento: '',
    bairro: '',
    localidade: '',
    uf: '',
    numero: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();
  const alerts = usePromptAlerts();

  // Função para formatar CPF
  const formatCPF = (value: string) => {
    // Remove tudo que não é dígito
    const cleanValue = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    const limitedValue = cleanValue.slice(0, 11);
    
    // Aplica a máscara XXX.XXX.XXX-XX
    return limitedValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2');
  };

  // Função para formatar telefone
  const formatPhone = (value: string) => {
    // Remove tudo que não é dígito
    const cleanValue = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    const limitedValue = cleanValue.slice(0, 11);
    
    // Aplica a máscara (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    if (limitedValue.length <= 10) {
      return limitedValue
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      return limitedValue
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
  };

  // Função para formatar CEP
  const formatCEP = (value: string) => {
    // Remove tudo que não é dígito
    const cleanValue = value.replace(/\D/g, '');
    
    // Limita a 8 dígitos
    const limitedValue = cleanValue.slice(0, 8);
    
    // Aplica a máscara XXXXX-XXX
    return limitedValue.replace(/(\d{5})(\d)/, '$1-$2');
  };
  // Função para formatar UF
  const formatUF = (value: string) => {
    // Remove números e caracteres especiais, mantém apenas letras
    const cleanValue = value.replace(/[^a-zA-Z]/g, '');
    
    // Limita a 2 caracteres e converte para maiúsculo
    return cleanValue.slice(0, 2).toUpperCase();
  };

  // Função para buscar dados do CEP na API ViaCEP
  const fetchAddressByCEP = async (cep: string) => {
    // Remove formatação do CEP para a consulta
    const cleanCEP = cep.replace(/\D/g, '');
    
    // Verifica se o CEP tem 8 dígitos
    if (cleanCEP.length !== 8) {
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();
      
      // Verifica se retornou erro da API
      if (data.erro) {
        alerts.error('CEP não encontrado', 'Erro de validação');
        return;
      }

      // Preenche automaticamente os campos de endereço
      setFormData(prevData => ({
        ...prevData,
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        localidade: data.localidade || '',
        uf: data.uf || ''
      }));

      alerts.success('Endereço encontrado e preenchido automaticamente!', 'CEP válido');
    } catch (error) {
      alerts.error('Erro ao buscar CEP. Verifique sua conexão.', 'Erro de conexão');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      alerts.error('As senhas não coincidem', 'Erro de validação');
      return;
    }
    
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        cpf: formData.cpf,
        phone: formData.phone,
        cep: formData.cep,
        logradouro: formData.logradouro,
        complemento: formData.complemento,
        bairro: formData.bairro,
        localidade: formData.localidade,
        uf: formData.uf,
        numero: formData.numero
      });
      alerts.success('Conta criada com sucesso!', 'Bem-vindo!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar conta';
      alerts.error(errorMessage, 'Erro no cadastro');
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="w-full max-w-xs sm:max-w-md lg:max-w-lg bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 border border-blue-100 overflow-y-auto max-h-[95vh] sm:max-h-[90vh]">
        <div className="flex flex-col items-center gap-2">
          <User className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-blue-600 mb-2" />
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 text-center">
            Crie sua conta
          </h2>
          <p className="text-center text-gray-500 text-xs sm:text-sm">
            Ou{' '}
            <button
              onClick={onSwitchToLogin}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              entre na sua conta existente
            </button>
          </p>
        </div>
        <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-2 sm:py-3 rounded-md text-xs sm:text-sm text-center">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div>
              <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700">
                Nome completo
              </label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50 text-sm sm:text-base"
                  placeholder="Digite seu nome completo"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50 text-sm sm:text-base"
                  placeholder="Digite seu email"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                Tipo de conta
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <label className="relative">
                  <input
                    type="radio"
                    name="role"
                    value="client"
                    checked={formData.role === 'client'}
                    onChange={(e) => setFormData({...formData, role: e.target.value as 'client' | 'provider'})}
                    className="sr-only"
                  />
                  <div className={`border-2 rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${
                    formData.role === 'client'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="text-xs sm:text-sm font-medium text-gray-900">Cliente</div>
                    <div className="text-xs text-gray-500">Buscar e contratar serviços</div>
                  </div>
                </label>
                <label className="relative">
                  <input
                    type="radio"
                    name="role"
                    value="provider"
                    checked={formData.role === 'provider'}
                    onChange={(e) => setFormData({...formData, role: e.target.value as 'client' | 'provider'})}
                    className="sr-only"
                  />
                  <div className={`border-2 rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${
                    formData.role === 'provider'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="text-xs sm:text-sm font-medium text-gray-900">Prestador</div>
                    <div className="text-xs text-gray-500">Oferecer serviços</div>
                  </div>
                </label>
              </div>
            </div>            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label htmlFor="cpf" className="block text-xs sm:text-sm font-medium text-gray-700">
                  CPF
                </label>
                <div className="mt-1 relative">
                  <Hash className="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <input
                    id="cpf"
                    name="cpf"
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => {
                      const formattedCPF = formatCPF(e.target.value);
                      setFormData({...formData, cpf: formattedCPF});
                    }}
                    className="w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50 text-sm sm:text-base"
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Telefone
                </label>
                <div className="mt-1 relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={formData.phone}
                    onChange={(e) => {
                      const formattedPhone = formatPhone(e.target.value);
                      setFormData({...formData, phone: formattedPhone});
                    }}
                    className="w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50 text-sm sm:text-base"
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                  />
                </div>
              </div>
            </div>            <div>
              <label htmlFor="cep" className="block text-xs sm:text-sm font-medium text-gray-700">
                CEP
              </label>
              <div className="mt-1 relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <input
                  id="cep"
                  name="cep"
                  type="text"
                  value={formData.cep}
                  onChange={(e) => {
                    const formattedCEP = formatCEP(e.target.value);
                    setFormData({...formData, cep: formattedCEP});
                  }}
                  onBlur={(e) => {
                    // Busca endereço automaticamente quando o usuário sair do campo
                    const cleanCEP = e.target.value.replace(/\D/g, '');
                    if (cleanCEP.length === 8) {
                      fetchAddressByCEP(e.target.value);
                    }
                  }}
                  className="w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50 text-sm sm:text-base"
                  placeholder="00000-000"
                  maxLength={9}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Digite o CEP e os demais campos serão preenchidos automaticamente
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="logradouro" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Logradouro
                </label>
                <div className="mt-1 relative">
                  <input
                    id="logradouro"
                    name="logradouro"
                    type="text"
                    value={formData.logradouro}
                    onChange={(e) => setFormData({...formData, logradouro: e.target.value})}
                    className="w-full pl-3 pr-3 py-2 sm:py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50 text-sm sm:text-base"
                    placeholder="Digite o logradouro"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="numero" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Número
                </label>
                <div className="mt-1 relative">
                  <input
                    id="numero"
                    name="numero"
                    type="text"
                    value={formData.numero}
                    onChange={(e) => setFormData({...formData, numero: e.target.value})}
                    className="w-full pl-3 pr-3 py-2 sm:py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50 text-sm sm:text-base"
                    placeholder="Número"
                  />
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="complemento" className="block text-xs sm:text-sm font-medium text-gray-700">
                Complemento
              </label>
              <div className="mt-1 relative">
                <input
                  id="complemento"
                  name="complemento"
                  type="text"
                  value={formData.complemento}
                  onChange={(e) => setFormData({...formData, complemento: e.target.value})}
                  className="w-full pl-3 pr-3 py-2 sm:py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50 text-sm sm:text-base"
                  placeholder="Digite o complemento"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label htmlFor="bairro" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Bairro
                </label>
                <div className="mt-1 relative">
                  <input
                    id="bairro"
                    name="bairro"
                    type="text"
                    value={formData.bairro}
                    onChange={(e) => setFormData({...formData, bairro: e.target.value})}
                    className="w-full pl-3 pr-3 py-2 sm:py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50 text-sm sm:text-base"
                    placeholder="Digite o bairro"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="localidade" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Cidade
                </label>
                <div className="mt-1 relative">
                  <input
                    id="localidade"
                    name="localidade"
                    type="text"
                    value={formData.localidade}
                    onChange={(e) => setFormData({...formData, localidade: e.target.value})}
                    className="w-full pl-3 pr-3 py-2 sm:py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50 text-sm sm:text-base"
                    placeholder="Digite a cidade"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="uf" className="block text-xs sm:text-sm font-medium text-gray-700">
                  UF
                </label>
                <div className="mt-1 relative">
                  <input
                    id="uf"
                    name="uf"
                    type="text"
                    value={formData.uf}
                    onChange={(e) => {
                      const formattedUF = formatUF(e.target.value);
                      setFormData({...formData, uf: formattedUF});
                    }}
                    className="w-full pl-3 pr-3 py-2 sm:py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50 text-sm sm:text-base"
                    placeholder="SP"
                    maxLength={2}
                  />
                </div>
              </div>
            </div>            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Senha
                </label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50 text-sm sm:text-base"
                    placeholder="Digite sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Confirmar senha
                </label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50 text-sm sm:text-base"
                    placeholder="Confirme sua senha"
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 sm:py-3 rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed mt-4 sm:mt-6 text-sm sm:text-base"
          >
            {isLoading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>
      </div>
    </div>
  );
}