import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, Star, Award, Calendar } from "lucide-react";
import { ProviderLanding, ServiceLanding } from "../../types";

const API_URL = "http://localhost:3333";

interface Review {
  id: string;
  rating: number;
  rating_comment: string;
  client_name?: string;
  createdAt: string;
}

interface ProviderPublicProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerId: string;
}

export const ProviderPublicProfileModal: React.FC<ProviderPublicProfileModalProps> = ({
  isOpen,
  onClose,
  providerId
}) => {
  const [prestador, setPrestador] = useState<ProviderLanding | null>(null);
  const [servicos, setServicos] = useState<ServiceLanding[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && providerId) {
      setLoading(true);
      
      // Buscar dados do prestador
      Promise.all([
        axios.get<ProviderLanding>(`${API_URL}/providers/${providerId}`),
        axios.get<ServiceLanding[]>(`${API_URL}/providers/${providerId}/services`),
        axios.get<Review[]>(`${API_URL}/orders?provider_id=${providerId}`)
      ])
        .then(([prestadorRes, servicosRes, avaliacoesRes]) => {
          setPrestador(prestadorRes.data);
          setServicos(servicosRes.data);
          setAvaliacoes(avaliacoesRes.data);
        })
        .catch((error) => {
          console.error("Erro ao carregar dados do prestador:", error);
          setPrestador(null);
          setServicos([]);
          setAvaliacoes([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, providerId]);

  if (!isOpen) return null;

  const calculateAverageRating = () => {
    if (avaliacoes.length === 0) return 0;
    const sum = avaliacoes.reduce((acc, review) => acc + review.rating, 0);
    return (sum / avaliacoes.length).toFixed(1);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={`${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[95vh] sm:h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors z-10"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
            {loading ? (
            <div className="animate-pulse pr-8">
              <div className="h-6 sm:h-8 bg-white bg-opacity-30 rounded mb-2"></div>
              <div className="h-3 sm:h-4 bg-white bg-opacity-20 rounded w-2/3"></div>
            </div>
          ) : prestador ? (
            <div className="pr-8">
              <h2 className="text-xl sm:text-3xl font-bold mb-2">
                {prestador.bio || "Prestador de Serviço"}
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-blue-100">
                <div className="flex items-center gap-1">
                  <Award size={14} className="sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">
                    {prestador.cnpj ? "Pessoa Jurídica" : "Autônomo"}
                  </span>
                </div>
                {avaliacoes.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Star size={14} className="sm:w-4 sm:h-4 text-yellow-300 fill-current" />
                    <span className="text-xs sm:text-sm">
                      {calculateAverageRating()} ({avaliacoes.length} avaliações)
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 pr-8">
              <h2 className="text-lg sm:text-2xl font-bold">Prestador não encontrado</h2>
            </div>
          )}
        </div>        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loading ? (
            <div className="space-y-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>          ) : prestador ? (
            <div className="space-y-6 sm:space-y-8">
              {/* Especialidades */}
              {prestador.categories && prestador.categories.length > 0 && (
                <div>                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                    <Award className="text-blue-600" size={18} />
                    Especialidades
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {prestador.categories.map((category, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Serviços Oferecidos */}
              <div>                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                  Serviços Oferecidos
                </h3>
                {servicos.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Calendar className="text-gray-400" size={24} />
                    </div>
                    <p>Nenhum serviço cadastrado ainda</p>
                  </div>
                ) : (                  <div className="grid gap-4 sm:grid-cols-2">
                    {servicos.map((servico) => (
                      <div
                        key={servico.id}
                        className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-gray-50"
                      >
                        <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                          {servico.title}
                        </h4>
                        <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-3">
                          {servico.description || "Descrição não disponível"}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-blue-600 font-bold text-xs sm:text-sm">
                            {servico.price_min && servico.price_max
                              ? `R$ ${Number(servico.price_min).toFixed(2)} - R$ ${Number(servico.price_max).toFixed(2)}`
                              : "A combinar"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Avaliações */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Star className="text-yellow-500" size={20} />
                  Avaliações
                </h3>
                {avaliacoes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Star className="text-gray-400" size={24} />
                    </div>
                    <p>Este prestador ainda não possui avaliações</p>
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
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <X className="text-red-500" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Prestador não encontrado
              </h3>
              <p className="text-gray-600">
                Não foi possível carregar os dados do prestador.
              </p>
            </div>
          )}
        </div>        {/* Footer */}
        <div className="border-t border-gray-200 p-3 sm:p-4 bg-gray-50 flex-shrink-0">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 sm:px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
