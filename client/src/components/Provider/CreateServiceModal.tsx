import { useState, useEffect } from "react";
import { usePromptAlerts } from '../UI/AlertContainer';
import { X, DollarSign, FileText, Tag, Image } from 'lucide-react';

interface CreateServiceModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (serviceData: any) => void;
}

export function CreateServiceModal({ open, onClose, onCreate }: CreateServiceModalProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price_min: "",
    price_max: "",
    category_id: "",
    images: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState<any[]>([]);
  const alerts = usePromptAlerts();

  // Buscar categorias dinamicamente
  useEffect(() => {
    fetch("http://localhost:3333/categories")
      .then((res) => res.json())
      .then(setCategorias)
      .catch(() => setCategorias([]));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (
      !form.title ||
      !form.description ||
      !form.category_id ||
      form.price_min === "" ||
      form.price_max === ""
    ) {
      alerts.error("Preencha todos os campos obrigatórios.", "Campos obrigatórios");
      return;
    }
    
    if (form.description.length < 10) {
      alerts.warning("A descrição deve ter pelo menos 10 caracteres.", "Descrição muito curta");
      return;
    }
    
    const priceMin = parseFloat(form.price_min);
    const priceMax = parseFloat(form.price_max);
    
    if (isNaN(priceMin) || isNaN(priceMax)) {
      alerts.error("Preços devem ser números válidos.", "Erro de validação");
      return;
    }
    
    if (priceMin > priceMax) {
      alerts.warning("O preço mínimo não pode ser maior que o máximo.", "Preços inválidos");
      return;
    }

    setLoading(true);
    try {
      await onCreate({
        ...form,
        price_min: priceMin,
        price_max: priceMax,
      });
      
      // Exibir alert de sucesso
      alerts.success("Serviço cadastrado com sucesso!", "Novo Serviço");
      
      // Limpar formulário
      setForm({
        title: "",
        description: "",
        price_min: "",
        price_max: "",
        category_id: "",
        images: "",
        is_active: true,
      });
      
      // Fechar modal
      onClose();
    } catch (error) {
      alerts.error("Erro ao criar serviço. Tente novamente.", "Falha na operação");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-40 p-4 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full sm:max-w-lg mx-auto max-h-[85vh] sm:max-h-[85vh] overflow-hidden flex flex-col mb-4 sm:mb-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-3 sm:p-4 rounded-t-2xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Cadastrar Novo Serviço</h2>
              <p className="text-blue-100 text-sm mt-1">Preencha os dados do seu serviço</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-500 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Formulário - área scrollável */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 sm:p-4 space-y-4 pb-6">
            
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline w-4 h-4 mr-2" />
                Título do Serviço
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Desenvolvimento de Site"
                required
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline w-4 h-4 mr-2" />
                Descrição
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descreva seu serviço detalhadamente..."
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Mínimo 10 caracteres ({form.description.length}/10)
              </p>
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="inline w-4 h-4 mr-2" />
                Categoria
              </label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Selecione uma categoria...</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Preços */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline w-4 h-4 mr-2" />
                  Preço Mínimo (R$)
                </label>
                <input
                  type="number"
                  name="price_min"
                  value={form.price_min}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0,00"
                  required
                  min={0}
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline w-4 h-4 mr-2" />
                  Preço Máximo (R$)
                </label>
                <input
                  type="number"
                  name="price_max"
                  value={form.price_max}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0,00"
                  required
                  min={0}
                  step="0.01"
                />
              </div>
            </div>

            {/* URL da Imagem */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Image className="inline w-4 h-4 mr-2" />
                URL da Imagem
              </label>
              <input
                type="url"
                name="images"
                value={form.images}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://exemplo.com/imagem.jpg"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                URL válida da imagem que representa seu serviço
              </p>
            </div>

            {/* Ativo */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Serviço ativo (visível para clientes)
              </label>
            </div>
          </div>

          {/* Botões - footer fixo */}
          <div className="flex-shrink-0 flex flex-col gap-3 p-4 border-t border-gray-200 bg-gray-50">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white transition-colors text-base font-medium"
            >
              {loading ? "Cadastrando..." : "Cadastrar Serviço"}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-base font-medium text-gray-700"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
