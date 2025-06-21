import React, { useState, useEffect } from "react";

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
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>✕</button>
        <h2 className="text-xl font-bold mb-4">Editar Serviço</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="title" value={form.title || ""} onChange={handleChange} className="w-full border rounded px-2 py-1" placeholder="Título" />
          <textarea name="description" value={form.description || ""} onChange={handleChange} className="w-full border rounded px-2 py-1 resize-none " placeholder="Descrição" />
          <input name="price_min" value={form.price_min || ""} onChange={handleChange} className="w-full border rounded px-2 py-1" placeholder="Preço mínimo" />
          <input name="price_max" value={form.price_max || ""} onChange={handleChange} className="w-full border rounded px-2 py-1" placeholder="Preço máximo" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Salvar</button>
        </form>
      </div>
    </div>
  );
}