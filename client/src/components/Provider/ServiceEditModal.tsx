import React, { useState, useEffect } from "react";
import { Pencil, X } from "lucide-react";

interface ServiceFormData {
  title: string;
  description: string;
  price_min: number | string;
  price_max: number | string;
  [key: string]: any;
}

interface ServiceEditModalProps {
  open: boolean;
  service: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function ServiceEditModal({ open, service, onClose, onSave }: ServiceEditModalProps) {
  const [form, setForm] = useState(service || {});

  useEffect(() => {
    setForm(service || {});
  }, [service]);

  if (!open || !service) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev: ServiceFormData) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto relative animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-gradient-to-r from-blue-100 to-white rounded-t-2xl border-b">
          <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
            <Pencil className="text-blue-500 flex-shrink-0" size={22} />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Editar Serviço</h2>
          </div>
          <button className="text-gray-400 hover:text-gray-700 transition flex-shrink-0" onClick={onClose}>
            <X size={22} />
          </button>        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-4 sm:px-6 py-5">
          <input
            name="title"
            value={form.title || ""}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Título"
          />
          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Descrição"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              name="price_min"
              type="number"
              min={0}
              step="0.01"
              value={form.price_min || ""}
              onChange={handleChange}
              className="w-full sm:w-1/2 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Preço mínimo"
            />
            <input
              name="price_max"
              type="number"
              min={0}
              step="0.01"
              value={form.price_max || ""}
              onChange={handleChange}
              className="w-full sm:w-1/2 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Preço máximo"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold shadow transition text-sm"
          >
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
}