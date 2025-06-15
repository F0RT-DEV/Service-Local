import {createService, getServiceById, getAllService,getAllServicesByProviderId,getAllServicesByCategoryName} from "./service.model.js";
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
  const { categoryName } = req.params;
  try {
    const services = await getAllServicesByCategoryName(categoryName);
	if (!services || services.length === 0) {
	  return res.status(404).json({ error: "Nenhum serviço encontrado para esta categoria" });
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
			return res.status(401).json({ error: "Prestador não autenticado" });
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