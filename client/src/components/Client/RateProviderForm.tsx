import { useEffect } from "react";
import { Star, X } from "lucide-react";

interface RateProviderModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  onRated: () => void;
}

import { useState } from "react";

export function RateProviderModal({ open, onClose, orderId, onRated }: RateProviderModalProps) {
  const token = localStorage.getItem('token');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fechar modal com ESC
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;  if (!token) {
    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 max-w-md w-full mx-auto text-center">
          <div className="text-red-600 mb-4 text-sm sm:text-base">Você precisa estar logado para avaliar o prestador.</div>
          <button onClick={onClose} className="mt-2 px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white text-sm transition-colors">Fechar</button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:3333/clients/orders/${orderId}/rate`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });
      if (!res.ok) throw new Error("Erro ao enviar avaliação");
      onRated();
      onClose();
    } catch (err: any) {
      setError(err.message || "Erro ao enviar avaliação");
    }
    setLoading(false);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 max-w-md w-full mx-auto relative animate-fade-in max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-700"
          aria-label="Fechar"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>        <h3 className="font-semibold text-lg sm:text-xl mb-4 sm:mb-6 text-yellow-700 flex items-center gap-2 pr-8">
          <Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" fill="#facc15" /> Avalie o prestador
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <span className="text-gray-700 font-medium text-sm sm:text-base">Nota:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 sm:h-7 sm:w-7 transition-colors ${
                      (hoverRating ?? rating) >= n ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill={(hoverRating ?? rating) >= n ? "#facc15" : "none"}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs sm:text-sm text-gray-500">{rating} estrela{rating > 1 && "s"}</span>
          </div>          <div className="mb-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
              placeholder="Deixe um comentário (opcional)"
              rows={3}
              maxLength={300}
            />
          </div>
          {error && <div className="text-red-600 mb-3 text-xs sm:text-sm">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-white py-2.5 sm:py-3 rounded-lg font-semibold shadow hover:from-yellow-600 hover:to-yellow-500 transition disabled:opacity-60 text-sm sm:text-base"
          >
            {loading ? "Enviando..." : "Enviar avaliação"}
          </button>
        </form>
      </div>
    </div>
  );
}