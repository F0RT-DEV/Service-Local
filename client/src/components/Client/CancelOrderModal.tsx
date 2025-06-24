import React, { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  loading?: boolean;
}

export function CancelOrderModal({ isOpen, onClose, onConfirm, loading = false }: CancelOrderModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setError("");
    }
  }, [isOpen]);

  // Fechar modal com ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!reason.trim()) {
      setError("Por favor, informe o motivo do cancelamento.");
      return;
    }
    
    if (reason.trim().length < 10) {
      setError("O motivo deve ter pelo menos 10 caracteres.");
      return;
    }
    
    onConfirm(reason.trim());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-red-50 border-b border-red-200 p-6 relative">
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute top-4 right-4 p-2 hover:bg-red-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X size={20} className="text-red-600" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">
                Cancelar Pedido
              </h3>
              <p className="text-sm text-red-600">
                Esta ação não poderá ser desfeita
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Motivo do cancelamento *
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors disabled:bg-gray-100 disabled:opacity-50"
              placeholder="Explique o motivo do cancelamento (mínimo 10 caracteres)..."
              rows={4}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500">
                {reason.length}/500 caracteres
              </span>
              <span className="text-xs text-gray-500">
                Mínimo: 10 caracteres
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Voltar
            </button>
            <button
              type="submit"
              disabled={loading || reason.trim().length < 10}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Cancelando..." : "Confirmar Cancelamento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
