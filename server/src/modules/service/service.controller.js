import {createService, getServiceById, getAllService,getAllServicesByProviderId,getAllServicesByCategory} from "./service.model.js";
import {serviceSchema} from "./service.schema.js";

export async function createServiceHandler(req, res) {
	try {
		const serviceData = serviceSchema.parse(req.body);

		const user_id = req.user?.id;
		const provider_id = req.user?.provider_id || null;

		if (!user_id) {
			return res.status(401).json({error: "Usuário não autenticado"});
		}

		const newService = await createService({
			...serviceData,

			provider_id: req.user?.provider_id,
			created_at: new Date(),
			updated_at: new Date(),
		});

		return res.status(201).json(newService);
	} catch (err) {
		return res
			.status(400)
			.json({
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
		return res.status(200).json(services);
	} catch (err) {
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
  const {categoryId} = req.params;
  try {
    const services = await getAllServicesByCategory(categoryId);
    return res.status(200).json(services);
  } catch (err) {
    return res.status(500).json({
      error: "Erro ao buscar serviços por categoria",
      details: err.message,
    });
  }
}
