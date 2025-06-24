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
  // Função utilitária para renderizar imagens (desktop/tabela)
  const renderImagens = (images: string) => {
    if (!images) return <span className="text-gray-400 text-xs">-</span>;
    const arr = Array.isArray(images) ? images : images.split(',');
    return (
      <div className="flex gap-1 flex-wrap">
        {arr.map((img, idx) =>
          img.trim() ? (
            <img
              key={idx}
              src={img.trim()}
              alt="Serviço"
              className="w-10 h-10 sm:w-14 sm:h-14 object-cover rounded shadow border border-gray-200"
              onError={e => (e.currentTarget.style.display = 'none')}
            />
          ) : null
        )}
      </div>
    );
  };
  // Função para renderizar imagem principal no mobile (maior e destacada)
  const renderImagemPrincipalMobile = (images: string) => {
    if (!images) return (
      <div className="w-full h-40 bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-blue-400 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <p className="text-blue-500 text-sm font-medium">Sem imagem</p>
        </div>
      </div>
    );
    
    const arr = Array.isArray(images) ? images : images.split(',');
    const primeiraImagem = arr.find(img => img.trim());
    
    if (!primeiraImagem) return (
      <div className="w-full h-40 bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-blue-400 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <p className="text-blue-500 text-sm font-medium">Sem imagem</p>
        </div>
      </div>
    );
    
    return (
      <div className="w-full h-40 relative bg-gray-100">
        <img
          src={primeiraImagem.trim()}
          alt="Serviço"
          className="w-full h-full object-cover"
          onError={e => {
            e.currentTarget.parentElement!.innerHTML = `
              <div class="w-full h-full bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div class="text-center">
                  <svg class="w-16 h-16 text-blue-400 mx-auto mb-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                  <p class="text-blue-500 text-sm font-medium">Erro ao carregar</p>
                </div>
              </div>
            `;
          }}
        />
        {/* Badge com número de imagens extras */}
        {arr.length > 1 && (
          <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-lg">
            +{arr.length - 1} fotos
          </div>
        )}
        {/* Gradiente sutil na parte inferior para melhor legibilidade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      </div>
    );
  };

  const getCategoryName = (id: string) =>
    categories.find((cat) => cat.id === id)?.name || id;  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-blue-800 flex items-center gap-2">
        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7V6a2 2 0 012-2h2.5a2 2 0 012 2v1M3 7h18M3 7v11a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 6 9-6" />
        </svg>
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
      
      {error && <div className="text-red-600 font-semibold mb-4 text-sm sm:text-base">{error}</div>}
      
      {!loading && !error && (
        services.length === 0 ? (
          <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded shadow mb-4 border border-yellow-200 text-sm sm:text-base">
            Nenhum serviço cadastrado.
          </div>
        ) : (
          <>            {/* Versão Mobile: Cards */}
            <div className="block lg:hidden space-y-6">
              {services.map((servico) => (
                <div key={servico.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  {/* Imagem principal destacada no topo do card */}
                  {servico.images && (
                    <div className="w-full">
                      {renderImagemPrincipalMobile(servico.images)}
                    </div>
                  )}
                  
                  {/* Conteúdo do card */}
                  <div className="p-5">
                    {/* Header com título e status */}
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-gray-900 text-lg sm:text-xl leading-tight flex-1 mr-3">{servico.title}</h3>
                      <div className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full shadow-sm flex-shrink-0 ${
                        servico.is_active == 1 || servico.is_active === true 
                          ? "bg-green-100 text-green-800 border border-green-200" 
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          servico.is_active == 1 || servico.is_active === true 
                            ? "bg-green-500" 
                            : "bg-red-500"
                        }`}></div>
                        {servico.is_active == 1 || servico.is_active === true ? "Ativo" : "Inativo"}
                      </div>
                    </div>
                    
                    {/* Descrição */}
                    <p className="text-gray-700 text-sm sm:text-base mb-5 leading-relaxed line-clamp-3">{servico.description}</p>
                    
                    {/* Informações em grid */}
                    <div className="space-y-4">
                      {/* Categoria */}
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                          </div>
                          <span className="text-blue-700 font-medium text-sm">Categoria</span>
                        </div>
                        <span className="font-bold text-blue-800 text-sm">{getCategoryName(servico.category_id)}</span>
                      </div>
                      
                      {/* Preços */}
                      <div className="p-4 bg-green-50 rounded-xl border border-green-100 hover:bg-green-100 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-green-100 rounded-full">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <span className="text-green-700 font-medium text-sm">Faixa de Preços</span>
                        </div>
                        <div className="bg-white rounded-lg p-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-green-600 font-medium">Mínimo:</span>
                            <span className="font-bold text-green-800 text-base">
                              R$ {parseFloat(String(servico.price_min || 0)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div className="w-full h-px bg-green-200"></div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-green-600 font-medium">Máximo:</span>
                            <span className="font-bold text-green-800 text-base">
                              R$ {parseFloat(String(servico.price_max || 0)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Versão Desktop: Tabela */}
            <div className="hidden lg:block overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
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
                      <td className="px-4 py-3 text-gray-700 max-w-xs">
                        <div className="truncate" title={servico.description}>{servico.description}</div>
                      </td>
                      <td className="px-4 py-3">{getCategoryName(servico.category_id)}</td>
                      <td className="px-4 py-3 text-green-700 font-semibold">
                        R$ {parseFloat(String(servico.price_min || 0)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-green-700 font-semibold">
                        R$ {parseFloat(String(servico.price_max || 0)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </td>
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
          </>
        )
      )}
    </div>
  );
}

export default MyProviderServices;
