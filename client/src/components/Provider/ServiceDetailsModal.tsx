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
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>✕</button>
        <h2 className="text-xl font-bold mb-2">{service.title}</h2>
        <p className="mb-2">{service.description}</p>
        <p className="mb-1 text-sm text-gray-600">Categoria: {service.category || service.category_id}</p>
        <p className="mb-1 text-sm text-gray-600">Preço: R$ {service.price_min} - R$ {service.price_max}</p>
        <p className="mb-1 text-sm text-gray-600">Status: {service.is_active ? "Ativo" : "Inativo"}</p>
        {service.images && (
          <img
            src={Array.isArray(service.images) ? service.images[0] : String(service.images).split(',')[0]}
            alt={service.title}
            className="w-full h-40 object-cover rounded mt-2"
            onError={e => (e.currentTarget.style.display = 'none')}
          />
        )}
      </div>
    </div>
  );
}