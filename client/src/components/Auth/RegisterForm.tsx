import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Phone, MapPin, Hash } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePromptAlerts } from '../UI/AlertContainer';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

function formatCPF(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2')
    .slice(0, 14);
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState({
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

  // Busca dados do endereço pelo CEP usando ViaCEP
  const handleCepBlur = async () => {
    const cep = formData.cep.replace(/\D/g, "");
    if (cep.length !== 8) {
      alerts.warning("CEP deve ter 8 dígitos.", "CEP inválido");
      return;
    }
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) {
        alerts.error("CEP não encontrado.", "Erro no CEP");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        logradouro: data.logradouro || "",
        bairro: data.bairro || "",
        localidade: data.localidade || "",
        uf: data.uf || "",
      }));
    } catch {
      alerts.error("Erro ao buscar o CEP.", "Erro no CEP");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-2 py-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 space-y-8 border border-blue-100 overflow-y-auto max-h-[90vh]">
        <div className="flex flex-col items-center gap-2">
          <User className="h-12 w-12 text-blue-600 mb-2" />
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            Crie sua conta
          </h2>
          <p className="text-center text-gray-500 text-sm">
            Ou{' '}
            <button
              onClick={onSwitchToLogin}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              entre na sua conta existente
            </button>
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm text-center">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome completo
              </label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  maxLength={100}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value.slice(0, 100)})}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                  placeholder="Digite seu nome completo"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  maxLength={100}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value.slice(0, 100)})}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                  placeholder="Digite seu email"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de conta
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative">
                  <input
                    type="radio"
                    name="role"
                    value="client"
                    checked={formData.role === 'client'}
                    onChange={(e) => setFormData({...formData, role: e.target.value as 'client' | 'provider'})}
                    className="sr-only"
                  />
                  <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    formData.role === 'client'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="text-sm font-medium text-gray-900">Cliente</div>
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
                  <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    formData.role === 'provider'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="text-sm font-medium text-gray-900">Prestador</div>
                    <div className="text-xs text-gray-500">Oferecer serviços</div>
                  </div>
                </label>
              </div>
            </div>
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                CPF
              </label>
              <div className="mt-1 relative">
                <Hash className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="cpf"
                  name="cpf"
                  type="text"
                  maxLength={14}
                  value={formatCPF(formData.cpf)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cpf: e.target.value.replace(/\D/g, "").slice(0, 11)
                    })
                  }
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                  placeholder="Digite seu CPF"
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <div className="mt-1 relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  maxLength={11}
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value.replace(/\D/g, "").slice(0, 15)
                    })
                  }
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                  placeholder="Digite seu telefone"
                />
              </div>
            </div>
            <div>
              <label htmlFor="cep" className="block text-sm font-medium text-gray-700">
                CEP
              </label>
              <div className="mt-1 relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="cep"
                  name="cep"
                  type="text"
                  maxLength={8}
                  value={formData.cep}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cep: e.target.value.replace(/\D/g, "").slice(0, 8)
                    })
                  }
                  onBlur={handleCepBlur}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                  placeholder="Digite seu CEP"
                />
              </div>
            </div>
            <div>
              <label htmlFor="logradouro" className="block text-sm font-medium text-gray-700">
                Logradouro
              </label>
              <div className="mt-1 relative">
                <input
                  id="logradouro"
                  name="logradouro"
                  type="text"
                  maxLength={100}
                  value={formData.logradouro}
                  onChange={(e) => setFormData({...formData, logradouro: e.target.value.slice(0, 100)})}
                  className="w-full pl-3 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                  placeholder="Digite o logradouro"
                />
              </div>
            </div>
            <div>
              <label htmlFor="complemento" className="block text-sm font-medium text-gray-700">
                Complemento
              </label>
              <div className="mt-1 relative">
                <input
                  id="complemento"
                  name="complemento"
                  type="text"
                  maxLength={50}
                  value={formData.complemento}
                  onChange={(e) => setFormData({...formData, complemento: e.target.value.slice(0, 50)})}
                  className="w-full pl-3 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                  placeholder="Digite o complemento"
                />
              </div>
            </div>
            <div>
              <label htmlFor="bairro" className="block text-sm font-medium text-gray-700">
                Bairro
              </label>
              <div className="mt-1 relative">
                <input
                  id="bairro"
                  name="bairro"
                  type="text"
                  maxLength={50}
                  value={formData.bairro}
                  onChange={(e) => setFormData({...formData, bairro: e.target.value.slice(0, 50)})}
                  className="w-full pl-3 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                  placeholder="Digite o bairro"
                />
              </div>
            </div>
            <div>
              <label htmlFor="localidade" className="block text-sm font-medium text-gray-700">
                Cidade
              </label>
              <div className="mt-1 relative">
                <input
                  id="localidade"
                  name="localidade"
                  type="text"
                  maxLength={50}
                  value={formData.localidade}
                  onChange={(e) => setFormData({...formData, localidade: e.target.value.slice(0, 50)})}
                  className="w-full pl-3 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                  placeholder="Digite a cidade"
                />
              </div>
            </div>
            <div>
              <label htmlFor="uf" className="block text-sm font-medium text-gray-700">
                UF
              </label>
              <div className="mt-1 relative">
                <input
                  id="uf"
                  name="uf"
                  type="text"
                  maxLength={2}
                  value={formData.uf}
                  onChange={(e) => setFormData({...formData, uf: e.target.value.slice(0, 2).toUpperCase()})}
                  className="w-full pl-3 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                  placeholder="UF"
                />
              </div>
            </div>
            <div>
              <label htmlFor="numero" className="block text-sm font-medium text-gray-700">
                Número
              </label>
              <div className="mt-1 relative">
                <input
                  id="numero"
                  name="numero"
                  type="text"
                  maxLength={10}
                  value={formData.numero}
                  onChange={(e) => setFormData({...formData, numero: e.target.value.slice(0, 10)})}
                  className="w-full pl-3 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                  placeholder="Número"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  maxLength={50}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar senha
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  maxLength={50}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                  placeholder="Confirme sua senha"
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>
      </div>
    </div>
  );
}