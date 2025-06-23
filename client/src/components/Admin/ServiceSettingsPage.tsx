import { useEffect, useState } from 'react';
import { Card } from '../UI/Card';
import { ActionButton } from '../UI/ActionButton';

const API_URL = 'http://localhost:3333';

interface Category {
  id: string;
  name: string;
}

export function ServiceSettingsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setError('Erro ao buscar categorias');
    } finally {
      setLoading(false);
    }
  };

 const handleCreateCategory = async () => {
  if (!newCategoryName.trim()) {
    setError('O nome da categoria é obrigatório');
    return;
  }
  setLoading(true);
  try {
    const response = await fetch(`${API_URL}/categories`, { // <-- ajuste aqui
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ name: newCategoryName }),
    });
    if (!response.ok) throw new Error('Erro ao criar categoria');
    setNewCategoryName('');
    setError('');
    fetchCategories();
  } catch (error: any) {
    setError(error.message || 'Erro ao criar categoria');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-2xl mx-auto py-8">
<Card className="p-8">
        <h2 className="text-2xl font-bold mb-2">Configurações de Serviços</h2>
        <p className="text-gray-600 mb-6">Configurar parâmetros para serviços</p>
        {/* Formulário de criação */}
        <div className="mb-8 flex gap-2 items-end bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nova Categoria
            </label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nome da nova categoria"
              className="border rounded p-2 w-full focus:ring-2 focus:ring-blue-200 transition"
              disabled={loading}
            />
          </div>
          <ActionButton onClick={handleCreateCategory} variant="success" disabled={loading}>
            {loading ? 'Criando...' : 'Criar Categoria'}
          </ActionButton>
        </div>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {/* Lista de categorias */}
        <div className="mt-8">
          <h3 className="text-md font-semibold mb-4">Categorias Existentes:</h3>
          {loading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <span className="animate-spin h-5 w-5 border-2 border-blue-400 border-t-transparent rounded-full"></span>
              Carregando categorias...
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 border border-blue-200 shadow-sm hover:shadow transition"
                >
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>
                  <span className="font-medium text-blue-900">{category.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}