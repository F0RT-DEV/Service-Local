import React, { useState } from "react";
import { usePromptAlerts } from '../UI/AlertContainer';
import { Calendar, MapPin, Home, Building2, FileText } from 'lucide-react';

// Modal para o cliente solicitar um serviço.
// Exibe formulário para preencher data, endereço e observações.
// Ao enviar, faz POST para /clients/orders criando uma nova ordem.


interface RequestOrderModalProps {
  serviceId: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function RequestOrderModal({ serviceId, open, onClose, onSuccess }: RequestOrderModalProps) {
  const [form, setForm] = useState({
    scheduled_date: "",
    cep: "",
    logradouro: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
    notes: "",
  });  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const alerts = usePromptAlerts();

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
      setForm(prevForm => ({
        ...prevForm,
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        uf: data.uf || ''
      }));

      alerts.success('Endereço encontrado e preenchido automaticamente!', 'CEP válido');
    } catch (error) {
      alerts.error('Erro ao buscar CEP. Verifique sua conexão.', 'Erro de conexão');
    }
  };

  if (!open) return null;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    // Aplica formatação específica para cada campo
    if (name === 'cep') {
      formattedValue = formatCEP(value);
    } else if (name === 'uf') {
      formattedValue = formatUF(value);
    }
    
    setForm({ ...form, [name]: formattedValue });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Validações básicas
    if (!form.scheduled_date) {
      alerts.warning('Por favor, selecione uma data para o serviço', 'Data obrigatória');
      setLoading(false);
      return;
    }
    
    if (!form.cep || !form.logradouro || !form.bairro || !form.cidade || !form.uf) {
      alerts.error('Por favor, preencha todos os campos de endereço obrigatórios', 'Campos obrigatórios');
      setLoading(false);
      return;
    }
    
    const token = localStorage.getItem("token");
    if (!token) {
      alerts.error('Você precisa estar logado para solicitar um serviço', 'Erro de autenticação');
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch("http://localhost:3333/clients/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          service_id: serviceId,
          scheduled_date: form.scheduled_date,
          address: {
            cep: form.cep,
            logradouro: form.logradouro,
            complemento: form.complemento,
            bairro: form.bairro,
            cidade: form.cidade,
            uf: form.uf,
          },
          notes: form.notes,
        }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao criar ordem");
      }
      
      // Limpar formulário após sucesso
      setForm({
        scheduled_date: "",
        cep: "",
        logradouro: "",
        complemento: "",
        bairro: "",
        cidade: "",
        uf: "",
        notes: "",
      });
      
      onSuccess();
      onClose();
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao criar ordem";
      setError(errorMessage);
      alerts.error(errorMessage, 'Erro na Solicitação');
    }
    setLoading(false);
  };  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black bg-opacity-40 p-2 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-lg mx-auto max-h-[95vh] sm:max-h-[85vh] overflow-hidden flex flex-col mt-8 sm:mt-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-2 sm:p-3 rounded-t-2xl flex-shrink-0">
          <h2 className="text-base sm:text-lg font-bold">Solicitar Serviço</h2>
          <p className="text-blue-100 text-xs mt-1">Preencha os dados para solicitar o serviço</p>
        </div>        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-2 sm:p-3 space-y-1.5 sm:space-y-2 flex-1 overflow-y-auto">
          {/* Data Agendada */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              <Calendar className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Data Agendada
            </label>
            <input
              type="datetime-local"
              name="scheduled_date"
              value={form.scheduled_date}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* CEP */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              <MapPin className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              CEP
            </label>
            <input
              type="text"
              name="cep"
              value={form.cep}
              onChange={handleChange}
              onBlur={(e) => {
                // Busca endereço automaticamente quando o usuário sair do campo
                const cleanCEP = e.target.value.replace(/\D/g, '');
                if (cleanCEP.length === 8) {
                  fetchAddressByCEP(e.target.value);
                }
              }}
              required
              maxLength={9}
              className="w-full border border-gray-300 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="00000-000"
            />
            <p className="text-xs text-gray-500 mt-0.5">
              Digite o CEP e os demais campos serão preenchidos
            </p>
          </div>

          {/* Logradouro */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              <Home className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Logradouro
            </label>
            <input
              type="text"
              name="logradouro"
              value={form.logradouro}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Rua, Avenida, etc."
            />
          </div>

          {/* Complemento */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              <Building2 className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Complemento
            </label>            <input
              type="text"
              name="complemento"
              value={form.complemento}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Apartamento, casa, bloco..."
            />
          </div>

          {/* Grid: Bairro, Cidade, UF */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Bairro
              </label>
              <input
                type="text"
                name="bairro"
                value={form.bairro}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Bairro"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Cidade
              </label>
              <input
                type="text"
                name="cidade"
                value={form.cidade}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Cidade"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                UF
              </label>
              <input
                type="text"
                name="uf"
                value={form.uf}
                onChange={handleChange}
                required
                maxLength={2}
                className="w-full border border-gray-300 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
                placeholder="UF"
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              <FileText className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Observações
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Informações adicionais..."
            />
          </div>

          {/* Erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}          {/* Botões */}
          <div className="flex-shrink-0 flex flex-col sm:flex-row justify-end gap-2 p-2 sm:p-3 border-t border-gray-200 bg-gray-50">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-xs sm:text-sm font-medium text-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white transition-colors text-xs sm:text-sm font-medium"
            >
              {loading ? "Enviando..." : "Solicitar Serviço"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}