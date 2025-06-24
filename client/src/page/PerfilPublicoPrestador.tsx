import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Award, 
  Calendar,
  User,
  Briefcase,
  Clock,
  CheckCircle
} from "lucide-react";
import { ProviderLanding, ServiceLanding } from "../types";

const API_URL = "http://localhost:3333";

interface Review {
  id: string;
  rating: number;
  rating_comment: string;
  client_name?: string;
  createdAt: string;
}

const PerfilPublicoPrestador: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [prestador, setPrestador] = useState<ProviderLanding | null>(null);
  const [servicos, setServicos] = useState<ServiceLanding[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Buscar dados do prestador
        const prestadorResponse = await axios.get(`${API_URL}/providers/${id}`);
        setPrestador(prestadorResponse.data);

        // Buscar serviços do prestador
        const servicosResponse = await axios.get(`${API_URL}/providers/${id}/services`);
        setServicos(servicosResponse.data);

        // Buscar avaliações do prestador
        const avaliacoesResponse = await axios.get(`${API_URL}/orders?provider_id=${id}`);
        setAvaliacoes(avaliacoesResponse.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setPrestador(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          className={i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
        />
      );
    }
    return stars;
  };

  const calculateAverageRating = () => {
    if (avaliacoes.length === 0) return 0;
    const total = avaliacoes.reduce((sum, av) => sum + (av.rating || 0), 0);
    return (total / avaliacoes.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Carregando perfil do prestador...</p>
        </div>
      </div>
    );
  }

  if (!prestador) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <User className="text-red-500" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Prestador não encontrado
          </h2>
          <p className="text-gray-600 mb-6">
            Não foi possível carregar os dados do prestador solicitado.
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={20} />
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com navegação */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header do perfil */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          
          {/* Informações principais */}
          <div className="px-8 py-6 -mt-16 relative">
            <div className="flex flex-col lg:flex-row lg:items-end gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  {prestador.avatar_url ? (
                    <img
                      src={prestador.avatar_url}
                      alt={prestador.bio || "Prestador"}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                {prestador.verified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Info principal */}
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                  {prestador.bio || "Prestador de Serviço"}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} />
                    <span>{prestador.cnpj ? "Pessoa Jurídica" : "Autônomo"}</span>
                  </div>
                  
                  {prestador.location && (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{prestador.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Membro desde 2024</span>
                  </div>
                </div>

                {/* Categorias */}
                {prestador.categories && prestador.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {prestador.categories.map((category, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Estatísticas */}
              <div className="flex gap-6 lg:flex-col lg:text-right">
                <div className="text-center lg:text-right">
                  <div className="text-2xl font-bold text-gray-800">
                    {avaliacoes.length}
                  </div>
                  <div className="text-sm text-gray-600">Avaliações</div>
                </div>
                
                <div className="text-center lg:text-right">
                  <div className="flex items-center gap-1 justify-center lg:justify-end">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-bold text-gray-800">
                      {calculateAverageRating()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">Nota média</div>
                </div>
                
                <div className="text-center lg:text-right">
                  <div className="text-2xl font-bold text-gray-800">
                    {servicos.length}
                  </div>
                  <div className="text-sm text-gray-600">Serviços</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Serviços oferecidos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Serviços Oferecidos
                </h2>
              </div>

              {servicos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Briefcase className="text-gray-400" size={24} />
                  </div>
                  <p className="text-gray-600">Nenhum serviço cadastrado ainda.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {servicos.map((servico) => (
                    <div
                      key={servico.id}
                      className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {servico.title}
                        </h3>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">
                            {servico.price_min && servico.price_max
                              ? `R$ ${Number(servico.price_min).toFixed(2)} - R$ ${Number(servico.price_max).toFixed(2)}`
                              : "A combinar"}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {servico.description || "Sem descrição disponível"}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          <span>Disponível para contato</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award size={14} />
                          <span>Serviço profissional</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Avaliações */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Avaliações dos Clientes
                </h3>
              </div>

              {avaliacoes.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Star className="text-gray-400" size={24} />
                  </div>
                  <p className="text-gray-600">
                    Este prestador ainda não possui avaliações.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {avaliacoes.slice(0, 5).map((avaliacao, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {renderStars(avaliacao.rating)}
                          </div>
                          <span className="text-sm text-gray-600">
                            {avaliacao.client_name || "Cliente"}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(avaliacao.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">
                        {avaliacao.rating_comment || "Sem comentário"}
                      </p>
                    </div>
                  ))}
                  {avaliacoes.length > 5 && (
                    <p className="text-center text-gray-500 text-sm">
                      E mais {avaliacoes.length - 5} avaliações...
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Contato */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Entre em contato
              </h3>
              <div className="space-y-3">
                {prestador.phone && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone size={16} />
                    <span>{prestador.phone}</span>
                  </div>
                )}
                {prestador.email && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail size={16} />
                    <span className="break-all">{prestador.email}</span>
                  </div>
                )}
              </div>
              
              <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                Solicitar Orçamento
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilPublicoPrestador;
