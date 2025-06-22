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
      <Card>
        <h2 className="text-2xl font-bold mb-2">Configurações de Serviços</h2>
        <p className="text-gray-600 mb-6">Configurar parâmetros para serviços</p>
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nome da nova categoria"
            className="border rounded p-2 flex-1"
            disabled={loading}
          />
          <ActionButton onClick={handleCreateCategory} variant="success" disabled={loading}>
            Criar Categoria
          </ActionButton>
        </div>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-2">Categorias Existentes:</h3>
          {loading ? (
            <div>Carregando categorias...</div>
          ) : (
            <ul>
              {categories.map((category) => (
                <li key={category.id} className="py-1">
                  {category.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
}