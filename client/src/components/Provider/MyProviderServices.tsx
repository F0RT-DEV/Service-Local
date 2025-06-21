import { useEffect, useState } from 'react';

interface Service {
  id: string;
  category_id: string;
  title: string;
  description: string;
  price_min: number;
  price_max: number;
  images: string;
  is_active?: boolean | number;
}

interface Category {
  id: string;
  name: string;
}

export function MyProviderServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Buscar categorias
  useEffect(() => {
    fetch('http://localhost:3333/categories')
      .then(res => res.json())
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // Buscar serviços do próprio prestador autenticado
  useEffect(() => {
    const fetchMyServices = async () => {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Você precisa estar logado para ver seus serviços.');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('http://localhost:3333/services/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Erro ao buscar seus serviços');
        const data = await res.json();
        setServices(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || 'Erro ao buscar seus serviços');
      }
      setLoading(false);
    };
    fetchMyServices();
  }, []);

  // Função utilitária para renderizar imagens
  const renderImagens = (images: string) => {
    if (!images) return <span className="text-gray-400">-</span>;
    const arr = Array.isArray(images) ? images : images.split(',');
    return (
      <div className="flex gap-1 flex-wrap">
        {arr.map((img, idx) =>
          img.trim() ? (
            <img
              key={idx}
              src={img.trim()}
              alt="Serviço"
              className="w-14 h-14 object-cover rounded shadow border border-gray-200"
              onError={e => (e.currentTarget.style.display = 'none')}
            />
          ) : null
        )}
      </div>
    );
  };

  const getCategoryName = (id: string) =>
    categories.find((cat) => cat.id === id)?.name || id;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 flex items-center gap-2">
        <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7V6a2 2 0 012-2h2.5a2 2 0 012 2v1M3 7h18M3 7v11a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 6 9-6" /></svg>
        Meus Serviços
      </h2>
      {loading && (
        <div className="flex items-center gap-2 text-blue-600 font-medium">
          <svg className="animate-spin h-5 w-5 mr-2 text-blue-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          Carregando serviços...
        </div>
      )}
      {error && <div className="text-red-600 font-semibold mb-4">{error}</div>}
      {!loading && !error && (
        services.length === 0 ? (
          <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded shadow mb-4 border border-yellow-200">
            Nenhum serviço cadastrado.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Título</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Descrição</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Categoria</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Preço Mínimo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Preço Máximo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Imagens</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Ativo?</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {services.map((servico) => (
                  <tr key={servico.id} className="hover:bg-blue-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-900">{servico.title}</td>
                    <td className="px-4 py-3 text-gray-700">{servico.description}</td>
                    <td className="px-4 py-3">{getCategoryName(servico.category_id)}</td>
                    <td className="px-4 py-3 text-green-700 font-semibold">R$ {servico.price_min}</td>
                    <td className="px-4 py-3 text-green-700 font-semibold">R$ {servico.price_max}</td>
                    <td className="px-4 py-3">{renderImagens(servico.images)}</td>
                    <td className="px-4 py-3">
                      {servico.is_active == 1 || servico.is_active === true ? (
                        <span className="inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded">Sim</span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded">Não</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}