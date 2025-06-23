import { BadgeCheck, X } from "lucide-react";
import React from "react";

interface ServiceDetailsModalProps {
  open: boolean;
  service: any;
  onClose: () => void;
}

export function ServiceDetailsModal({ open, service, onClose }: ServiceDetailsModalProps) {
  if (!open || !service) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-lg relative animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-orange-100 to-white rounded-t-2xl border-b">
          <div className="flex items-center gap-2">
            <BadgeCheck className="text-orange-500" size={22} />
            <h2 className="text-xl font-bold text-gray-900">{service.title}</h2>
          </div>
          <button className="text-gray-400 hover:text-gray-700 transition" onClick={onClose}>
            <X size={22} />
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-5">
          <p className="mb-2 text-gray-700">{service.description}</p>
          <div className="flex flex-wrap gap-3 mb-3">
            <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
              Categoria: {service.category || service.category_id}
            </span>
            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${service.is_active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
              {service.is_active ? "Ativo" : "Inativo"}
            </span>
          </div>
          <div className="mb-3">
            <span className="block text-sm text-gray-600 font-semibold">
              Preço:
              <span className="ml-2 text-base text-gray-900 font-bold">
                R$ {Number(service.price_min).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} - R$ {Number(service.price_max).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </span>
          </div>
          {service.images && (
            <img
              src={Array.isArray(service.images) ? service.images[0] : String(service.images).split(',')[0]}
              alt={service.title}
              className="w-full h-44 object-cover rounded-lg shadow border"
              onError={e => (e.currentTarget.style.display = 'none')}
            />
          )}
        </div>
      </div>
    </div>
  );
}