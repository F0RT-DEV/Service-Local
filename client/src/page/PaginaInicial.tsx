import React, { useEffect, useState } from "react";
import axios from "axios";
import { Category, ProviderLanding, ServiceLanding } from "../types";
import { ProviderPublicProfileModal } from "../components/Provider/ProviderPublicProfileModal";
import { Star, CheckCircle, Search, Users, Award } from "lucide-react";

const API_URL = "http://localhost:3333";

interface PaginaInicialProps {
  onNavigateToAuth: () => void;
}

const PaginaInicial: React.FC<PaginaInicialProps> = ({ onNavigateToAuth }) => {
  // Estados para armazenar dados
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [prestadores, setPrestadores] = useState<ProviderLanding[]>([]);
  const [servicos, setServicos] = useState<ServiceLanding[]>([]);
  
  // Estados para o modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState<string>("");// Buscar categorias
  useEffect(() => {
    axios
      .get<Category[]>(`${API_URL}/categories`)
      .then((res) => setCategorias(res.data))
      .catch(() => setCategorias([]));
  }, []);

  // Buscar prestadores (exibir só alguns)
  useEffect(() => {
    axios
      .get<ProviderLanding[]>(`${API_URL}/providers`)
      .then((res) => setPrestadores(res.data.slice(0, 3)))
      .catch(() => setPrestadores([]));
  }, []);

  // Buscar serviços (exibir só alguns)
  useEffect(() => {
    axios
      .get<ServiceLanding[]>(`${API_URL}/services`)
      .then((res) => setServicos(res.data.slice(0, 6)))
      .catch(() => setServicos([]));
  }, []);
    // Função para navegar para autenticação
  const handleAuthNavigation = () => {
    onNavigateToAuth();
  };

  // Função para abrir modal do prestador
  const handleOpenProviderModal = (providerId: string) => {
    setSelectedProviderId(providerId);
    setIsModalOpen(true);
  };  return (
    <div className="min-h-screen bg-gray-50">      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800 tracking-tight">
              AuxTech
            </h1>
          </div>
          <div className="flex gap-3 sm:gap-4">
            <button
              onClick={handleAuthNavigation}
              className="px-4 sm:px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              Entrar
            </button>
            <button
              onClick={handleAuthNavigation}
              className="px-4 sm:px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              Cadastrar
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-white pt-20">
        {/* Background with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(37, 99, 235, 0.95) 0%, rgba(29, 78, 216, 0.95) 100%), 
                            url('https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`
          }}
        />
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            Conectando{" "}
            <span className="text-orange-400 relative">
              profissionais qualificados
              <div className="absolute bottom-2 left-0 w-full h-3 bg-orange-400/30 -skew-x-12"></div>
            </span>{" "}
            a quem precisa de serviço
          </h1>
          <p className="text-lg md:text-xl mb-16 text-blue-100 max-w-2xl mx-auto">
            Soluções técnicas com segurança, agilidade e transparência
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <div className="bg-white rounded-2xl shadow-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">5.200+</div>
            <div className="text-gray-600 font-medium">Profissionais</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">18.700+</div>
            <div className="text-gray-600 font-medium">Serviços Realizados</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">4.8/5</div>
            <div className="text-gray-600 font-medium">Avaliação Média</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">35min</div>
            <div className="text-gray-600 font-medium">Tempo Médio</div>
          </div>
        </div>
      </section>
{/* CATEGORIAS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Categorias de Serviços
          </h2>
          <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full"></div>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {categorias.length === 0 && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando categorias...</p>
            </div>
          )}
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={handleAuthNavigation}
              className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg min-w-[160px]"
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>      {/* PRESTADORES EM DESTAQUE */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Profissionais em Destaque
            </h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {prestadores.length === 0 && (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando prestadores...</p>
              </div>
            )}
            {prestadores.map((p) => (
              <div
                key={p.provider_id || p.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 border border-gray-100"
              >
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Users className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
                    {p.bio || "Profissional"}
                  </h3>
                  <div className="text-center">
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium mb-3">
                      <Award className="w-4 h-4 mr-1" />
                      {p.cnpj ? "Pessoa Jurídica" : "Autônomo"}
                    </span>
                  </div>
                  <div className="text-center text-gray-600 text-sm">
                    {Array.isArray(p.categories)
                      ? p.categories.map((c) => c.name).join(", ")
                      : "Especialidades não informadas"}
                  </div>
                </div>
                <button
                  onClick={() => handleOpenProviderModal(p.provider_id || p.id || "")}
                  className="w-full px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105"
                >
                  Ver perfil
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>      {/* SERVIÇOS EM DESTAQUE */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Serviços Recentes
            </h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicos.length === 0 && (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando serviços...</p>
              </div>
            )}
            {servicos.map((s) => (
              <button
                key={s.id}
                onClick={handleAuthNavigation}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 border border-gray-100 text-left group"
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center mb-4">
                    <Search className="text-white" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {s.description || "Descrição não disponível"}
                  </p>
                  <div className="text-blue-600 font-bold text-lg">
                    {s.price_min && s.price_max
                      ? `R$ ${Number(s.price_min).toFixed(2)} - R$ ${Number(s.price_max).toFixed(2)}`
                      : "A combinar"}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="text-center mt-12">
            <button 
              onClick={handleAuthNavigation} 
              className="px-8 py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Ver todos os serviços
            </button>
          </div>        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Por que escolher a <span className="text-orange-500">AuxTech</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Oferecemos a melhor experiência para clientes e profissionais
            </p>
            <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full mt-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Clients */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 border-t-4 border-blue-500">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Users className="text-blue-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Para Clientes</h3>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
                  Profissionais verificados
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
                  Preços transparentes
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
                  Pagamento seguro
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
                  Avaliações reais
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
                  Garantia de satisfação
                </li>
              </ul>
            </div>

            {/* For Professionals */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 border-t-4 border-orange-500">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Award className="text-orange-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Para Profissionais</h3>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
                  Mais clientes qualificados
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
                  Gestão simplificada
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
                  Recebimentos garantidos
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
                  Reputação online
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
                  Ferramentas exclusivas
                </li>
              </ul>
            </div>

            {/* Platform Advantages */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 border-t-4 border-green-500">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Star className="text-green-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Nossa Plataforma</h3>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
                  Interface intuitiva
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
                  Sistema de avaliações
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
                  Suporte 24/7
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
                  Integração completa
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
                  Atualizações constantes
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Como funciona em <span className="text-orange-500">3 passos</span> simples
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Encontre, contrate e avalie - tudo em um só lugar
            </p>
            <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full mt-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg hover:scale-110 transition-transform duration-300">
                1
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <Search className="text-blue-600" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Encontre</h3>
                <p className="text-gray-600">
                  Busque pelo serviço necessário e localize profissionais próximos a você
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="w-20 h-20 bg-orange-500 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg hover:scale-110 transition-transform duration-300">
                2
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <Users className="text-orange-600" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Contrate</h3>
                <p className="text-gray-600">
                  Compare perfis, preços e avaliações antes de fechar o serviço
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center relative">
              <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg hover:scale-110 transition-transform duration-300">
                3
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <Star className="text-green-600" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Avalie</h3>
                <p className="text-gray-600">
                  Deixe seu feedback e ajude a melhorar nossa comunidade
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              O que nossos <span className="text-orange-500">clientes</span> dizem
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Avaliações reais de quem já usou nossa plataforma
            </p>
            <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full mt-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-current" size={20} />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Depois que comecei a usar a AuxTech, minha renda mensal aumentou em 60%. 
                Agora consigo gerenciar todos meus serviços em um só lugar!"
              </p>
              <div className="flex items-center">
                <img
                  src="https://labes.inf.ufes.br/wp-content/uploads/sem-foto.jpg"
                  alt="Carlos Silva"
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">Carlos Silva</h4>
                  <p className="text-gray-600 text-sm">Eletricista | São Paulo</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-current" size={20} />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Finalmente uma plataforma onde posso encontrar profissionais confiáveis 
                para resolver problemas em casa sem medo de ser enganada."
              </p>
              <div className="flex items-center">
                <img
                  src="https://labes.inf.ufes.br/wp-content/uploads/sem-foto.jpg"
                  alt="Ana Oliveira"
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">Ana Oliveira</h4>
                  <p className="text-gray-600 text-sm">Cliente | Rio de Janeiro</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-current" size={20} />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Como profissional autônomo, a AuxTech me deu visibilidade e clientes 
                que eu nunca conseguiria sozinho. Recomendo para todos os colegas!"
              </p>
              <div className="flex items-center">
                <img
                  src="https://labes.inf.ufes.br/wp-content/uploads/sem-foto.jpg"
                  alt="Roberto Santos"
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">Roberto Santos</h4>
                  <p className="text-gray-600 text-sm">Encanador | Belo Horizonte</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Pronto para transformar sua experiência com serviços técnicos?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Junte-se a milhares de clientes e profissionais satisfeitos
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={handleAuthNavigation}
              className="px-8 py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Encontrar Profissional
            </button>
            <button
              onClick={handleAuthNavigation}
              className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              Cadastrar como Profissional
            </button>
          </div>
        </div>
      </section>

      {/* Modal do Prestador */}
      <ProviderPublicProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        providerId={selectedProviderId}
      />
    </div>
  );
};

export default PaginaInicial;
