import { Search, Filter, MapPin } from 'lucide-react';
import { Card, CardContent } from '../UI/Card';
import { useEffect, useState } from 'react';

interface Category {
  id: string;
  name: string;
}

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  location: string;
  setLocation: (location: string) => void;
}

export function SearchFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  location,
  setLocation
}: SearchFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3333/categories');
        if (!res.ok) throw new Error('Erro ao buscar categorias');
        const data = await res.json();
        setCategories(data);
      } catch {
        setCategories([]);
      }
      setLoading(false);
    };
    fetchCategories();
  }, []);

  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar serviços..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todas as categorias</option>
            {loading ? (
              <option disabled>Carregando...</option>
            ) : (
              categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            )}
          </select>          {/* Location Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Filtro por cidade (em breve...)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-100 placeholder-gray-400 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setLocation('');
            }}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Filter className="h-4 w-4 mr-2" />
            Limpar
          </button></div>
      </CardContent>
    </Card>
  );
}