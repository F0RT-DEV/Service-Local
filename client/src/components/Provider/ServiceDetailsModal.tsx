import {BadgeCheck, X} from "lucide-react";

interface ServiceDetailsModalProps {
	open: boolean;
	service: any;
	onClose: () => void;
}

export function ServiceDetailsModal({
	open,
	service,
	onClose,
}: ServiceDetailsModalProps) {
	if (!open || !service) return null;	return (
		<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-lg mx-auto relative animate-fade-in max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-gradient-to-r from-orange-100 to-white rounded-t-2xl border-b">
					<div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
						<BadgeCheck className="text-orange-500 flex-shrink-0" size={22} />
						<h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{service.title}</h2>
					</div>
					<button
						className="text-gray-400 hover:text-gray-700 transition flex-shrink-0"
						onClick={onClose}
					>
						<X size={22} />
					</button>
				</div>
				{/* Body */}
				<div className="px-4 sm:px-6 py-5">					<p className="mb-3 text-gray-700 text-sm sm:text-base">{service.description}</p>
					<div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
						<span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
							Categoria: {service.category_title || "Sem categoria"}
						</span>
						<span
							className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
								service.is_active
									? "bg-green-100 text-green-700"
									: "bg-gray-200 text-gray-500"
							}`}
						>
							{service.is_active ? "Ativo" : "Inativo"}
						</span>
					</div>{" "}
					<div className="mb-4">
						<span className="block text-sm text-gray-600 font-semibold">
							Preço:
							<span className="ml-2 text-sm sm:text-base text-gray-900 font-bold">
								R${" "}
								{parseFloat(String(service.price_min || 0)).toLocaleString(
									"pt-BR",
									{minimumFractionDigits: 2}
								)}{" "}
								- R${" "}
								{parseFloat(String(service.price_max || 0)).toLocaleString(
									"pt-BR",
									{minimumFractionDigits: 2}
								)}
							</span>
						</span>
					</div>
					{service.images && (
						<img
							src={
								Array.isArray(service.images)
									? service.images[0]
									: String(service.images).split(",")[0]
							}
							alt={service.title}
							className="w-full h-32 sm:h-44 object-cover rounded-lg shadow border"
							onError={(e) => (e.currentTarget.style.display = "none")}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
