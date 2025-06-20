import { useState } from "react";

interface RateProviderFormProps {
  orderId: string;
  onRated: () => void;
}

export function RateProviderForm({ orderId, onRated }: RateProviderFormProps) {
  const token = localStorage.getItem('token');
    if (!token) {
        return <div className="text-red-600">Você precisa estar logado para avaliar o prestador.</div>;
    }
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    } catch (err: any) {
      setError(err.message || "Erro ao enviar avaliação");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-4 mt-4 bg-yellow-50">
      <h3 className="font-medium mb-2">Avalie o prestador</h3>
      <div className="flex items-center gap-2 mb-2">
        <label className="mr-2">Nota:</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{n} estrela{n > 1 && "s"}</option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border rounded px-2 py-1"
          placeholder="Comentário (opcional)"
        />
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <button
        type="submit"
        disabled={loading}
        className="bg-yellow-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Enviando..." : "Enviar avaliação"}
      </button>
    </form>
  );
}