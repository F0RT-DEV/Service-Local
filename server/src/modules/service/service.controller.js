import {
	createService,
	getServiceById,
	getAllService,
	getAllServicesByProviderId,
	getAllServicesByCategoryName,
	countAllServicesByProviderId,
	updateService, // <-- ADICIONE ESTA LINHA
} from "./service.model.js";
import {serviceSchema} from "./service.schema.js";
import {getById} from "../provider/provider.model.js";

export async function createServiceHandler(req, res) {
	try {
		const serviceData = serviceSchema.parse(req.body);

		const provider_id = req.user?.provider_id || null;

		if (!provider_id) {
			return res.status(401).json({error: "Prestador não autenticado"});
		}

		// Buscar dados completos do prestador no banco
		const provider = await getById(provider_id);

		if (!provider) {
			return res.status(404).json({error: "Prestador não encontrado"});
		}

		if (provider.status === "pending" || provider.status === "rejected") {
			return res.status(403).json({
				error:
					"Status inválido. Apenas prestadores 'active' ou 'inactive' podem criar serviços.",
			});
		}

		const newService = await createService({
			...serviceData,
			provider_id,
			created_at: new Date(),
			updated_at: new Date(),
		});

		return res.status(201).json(newService);
	} catch (err) {
		return res.status(400).json({
			error: "Erro ao criar serviço",
			details: err.errors || err.message,
		});
	}
}

export async function getServiceByIdHandler(req, res) {
	const {id} = req.params;
	try {
		const service = await getServiceById(id);
		if (!service) {
			return res.status(404).json({error: "Serviço não encontrado"});
		}
		return res.status(200).json(service);
	} catch (err) {
		return res.status(500).json({
			error: "Erro ao buscar serviço",
			details: err.message,
		});
	}
}
export async function getAllServicesHandler(req, res) {
	try {
		const services = await getAllService();

		// Filtra apenas os serviços com status "active"
		const activeServices = services.filter(
			(service) => service.is_active === 1
		);

		return res.status(200).json(activeServices);
	} catch (err) {
		console.error("Erro ao buscar serviços:", err);
		return res.status(500).json({
			error: "Erro ao buscar serviços",
			details: err.message,
		});
	}
}
export async function getAllServicesByProviderIdHandler(req, res) {
	const {providerId} = req.params;
	try {
		const services = await getAllServicesByProviderId(providerId);
		return res.status(200).json(services);
	} catch (err) {
		return res.status(500).json({
			error: "Erro ao buscar serviços do prestador",
			details: err.message,
		});
	}
}
export async function getAllServicesByCategoryHandler(req, res) {
	const {categoryName} = req.params;
	try {
		const services = await getAllServicesByCategoryName(categoryName);
		if (!services || services.length === 0) {
			return res
				.status(404)
				.json({error: "Nenhum serviço encontrado para esta categoria"});
		}
		return res.status(200).json(services);
	} catch (err) {
		return res.status(500).json({
			error: "Erro ao buscar serviços por nome da categoria",
			details: err.message,
		});
	}
}
export async function getMyServicesHandler(req, res) {
	try {
		const providerId = req.user?.provider_id;

		if (!providerId) {
			return res.status(401).json({error: "Prestador não autenticado"});
		}

		const services = await getAllServicesByProviderId(providerId);
		return res.status(200).json(services);
	} catch (err) {
		return res.status(500).json({
			error: "Erro ao buscar serviços do prestador",
			details: err.message,
		});
	}
}
export async function getTotalServicesForProvider(req, res) {
	try {
		const providerId = req.user?.provider_id;
		if (!providerId)
			return res.status(401).json({error: "Prestador não autenticado"});
		const result = await countAllServicesByProviderId(providerId);
		const total = Number(result.count || result["count(*)"] || 0);
		return res.status(200).json({total});
	} catch (err) {
		return res
			.status(500)
			.json({error: "Erro ao buscar total de serviços", details: err.message});
	}
}

export async function updateServiceHandler(req, res) {
	const {id} = req.params;
	const providerId = req.user?.provider_id;
	const updateData = req.body;

	if (!providerId) {
		return res.status(401).json({error: "Prestador não autenticado"});
	}

	try {
		// Garante que o serviço pertence ao prestador autenticado
		const service = await getServiceById(id);
		if (!service || service.provider_id !== providerId) {
			return res.status(403).json({error: "Acesso negado ao serviço"});
		}

		await updateService(id, updateData);
		const updated = await getServiceById(id);
		console.log(updateData);
		return res.status(200).json(updated);
	} catch (err) {
		return res.status(500).json({
			error: "Erro ao atualizar serviço",
			details: err.message,
		});
	}
}
