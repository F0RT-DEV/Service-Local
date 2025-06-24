import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, UserCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePromptAlerts } from '../UI/AlertContainer';
import { ResetPassword } from './ResetPassword';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showReset, setShowReset] = useState(false);
  const { login, isLoading } = useAuth();
  const alerts = usePromptAlerts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      alerts.success('Login realizado com sucesso!', 'Bem-vindo!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
      alerts.error(errorMessage, 'Erro de autenticação');
    }
  };

  if (showReset) {
    return <ResetPassword onBackToLogin={() => setShowReset(false)} />;
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-xs sm:max-w-md w-full bg-white rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 sm:space-y-8 border border-blue-100">
        <div className="flex flex-col items-center gap-2">
          <UserCircle2 className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-blue-600 mb-2" />
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 text-center">
            Bem-vindo de volta!
          </h2>
          <p className="text-center text-gray-500 text-xs sm:text-sm">
            Faça login para acessar sua conta
          </p>
        </div>
        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-2 sm:py-3 rounded-md text-xs sm:text-sm text-center">
              {error}
            </div>
          )}          <div className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-3 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50 text-gray-900 placeholder-gray-400 transition text-sm sm:text-base"
                  placeholder="Digite seu email"
                  autoComplete="username"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-8 sm:pr-10 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50 text-gray-900 placeholder-gray-400 transition text-sm sm:text-base"
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                  ) : (
                    <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                  )}
                </button>
              </div>
            </div>
          </div>          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 text-xs sm:text-sm">
            <button
              type="button"
              onClick={() => setShowReset(true)}
              className="text-blue-600 hover:underline transition"
            >
              Esqueceu a senha?
            </button>
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-gray-500 hover:text-blue-600 hover:underline transition"
            >
              Criar nova conta
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 sm:py-3 rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}