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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-100 to-white rounded-t-2xl border-b">
          <div className="flex items-center gap-2">
            <Pencil className="text-blue-500" size={22} />
            <h2 className="text-xl font-bold text-gray-900">Editar Serviço</h2>
          </div>
          <button className="text-gray-400 hover:text-gray-700 transition" onClick={onClose}>
            <X size={22} />
          </button>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <input
            name="title"
            value={form.title || ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Título"
          />
          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Descrição"
          />
          <div className="flex gap-3">
            <input
              name="price_min"
              type="number"
              min={0}
              value={form.price_min || ""}
              onChange={handleChange}
              className="w-1/2 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Preço mínimo"
            />
            <input
              name="price_max"
              type="number"
              min={0}
              value={form.price_max || ""}
              onChange={handleChange}
              className="w-1/2 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Preço máximo"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold shadow transition"
          >
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
}