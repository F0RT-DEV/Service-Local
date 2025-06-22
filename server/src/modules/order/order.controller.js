import {v4 as uuidv4} from "uuid";
import * as orderModel from "./order.model.js";
import * as serviceModel from "../service/service.model.js";
import {CreateOrderSchema} from "./order.schema.js";

export async function getAllOrders(req, res) {
	try {
		const orders = await orderModel.getAll();
		res.status(200).json(orders);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// CLIENTES

export async function createOrder(req, res) {
	try {
		const validated = CreateOrderSchema.parse(req.body);
		const id = uuidv4();
		const client_id = req.user.id;

		// Verifica se o cliente já tem uma ordem em andamento
		const existingOrder = await orderModel.findActiveByClientId(client_id);
		if (existingOrder) {
			return res.status(400).json({
				error:
					"Você já possui uma ordem em andamento. Finalize ou cancele antes de criar uma nova.",
			});
		}

		// Buscar serviço
		const service = await serviceModel.getById(validated.service_id);
		if (!service || !service.provider_id) {
			return res.status(400).json({error: "Serviço inválido ou sem prestador"});
		}

		// Verifica se o serviço está ativo
		if (service.is_active !== 1) {
			return res.status(400).json({
				error:
					"Este serviço não está ativo e não pode ser usado para criar uma ordem.",
			});
		}

		const order = {
			...validated,
			id,
			client_id,
			provider_id: service.provider_id,
			category_id: service.category_id,
			status: "pending",
			created_at: new Date(),
		};

		await orderModel.create(order);
		res.status(201).json(order);
	} catch (error) {
		console.error("Erro ao criar ordem:", error);
		res.status(400).json({error: error.errors || error.message});
	}
}

// export async function getClientOrders(req, res) {
// 	try {

// 		const {provider_id, client_id} = req.query;
// 		let orders;

// 		if (provider_id) {
// 			orders = await orderModel.getByProviderId(provider_id);
// 		} else if (client_id) {
// 			orders = await orderModel.getByClientId(client_id);
// 		} else {
// 			orders = await orderModel.getAll();
// 		}

// 		res.status(200).json(orders);
// 	} catch (error) {
// 		res.status(500).json({error: error.message});
// 	}
// }

export async function getClientOrders(req, res) {
	try {
		// Tenta pegar client_id ou provider_id da query, se não pega do usuário autenticado
		const {provider_id, client_id: queryClientId} = req.query;
		let orders;

		if (provider_id) {
			orders = await orderModel.getByProviderId(provider_id);
		} else if (queryClientId) {
			orders = await orderModel.getByClientId(queryClientId);
		} else if (req.user && req.user.id) {
			// Padrão: pega as ordens do usuário autenticado
			orders = await orderModel.getByClientId(req.user.id);
		} else {
			// Se não tiver nada, retorna erro
			return res
				.status(400)
				.json({error: "client_id não informado ou usuário não autenticado"});
		}

		res.status(200).json(orders);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

export async function getClientOrderById(req, res) {
	try {
		const {id} = req.params; // id da ordem
		const order = await orderModel.getById(id); // buscar ordem pelo ID da ordem
		if (!order) return res.status(404).json({error: "Ordem não encontrada"});

		if (order.client_id !== req.user.id)
			return res.status(403).json({error: "Acesso negado"});

		res.json(order);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

export async function cancelClientOrder(req, res) {
	try {
		const {id} = req.params;
		const order = await orderModel.getById(id);
		if (!order) return res.status(404).json({error: "Ordem não encontrada"});
		if (order.client_id !== req.user.id)
			return res.status(403).json({error: "Acesso negado"});
		if (order.status !== "pending") {
			return res.status(400).json({
				error:
					"A ordem só pode ser cancelada enquanto estiver com status 'pending'.",
			});
		}
		await orderModel.update(id, {
			status: "cancelled",
			cancelled_at: new Date(),
			cancel_reason: "Cancelado pelo cliente",
		});

		const updatedOrder = await orderModel.getById(id);
		res.json(updatedOrder);
	} catch (error) {
		res.status(400).json({error: error.message});
	}
}

export async function rateOrder(req, res) {
	try {
		const {id} = req.params;
		const {rating, comment} = req.body;

		if (!rating) return res.status(400).json({error: "Nota obrigatória"});

		const order = await orderModel.getById(id);
		if (!order) return res.status(404).json({error: "Ordem não encontrada"});
		if (order.client_id !== req.user.id)
			return res.status(403).json({error: "Acesso negado"});

		if (order.status !== "done")
			return res
				.status(400)
				.json({error: "Só é possível avaliar após a conclusão"});

		const updated = await orderModel.update(id, {
			rating,
			rating_comment: comment || null,
			rated_at: new Date(),
		});

		res.json(updated[0]);
	} catch (error) {
		res.status(400).json({error: error.message});
	}
}

// PRESTADORES

export async function getProviderOrders(req, res) {
	try {
		const providerId = req.user?.provider_id;
		const orders = await orderModel.getByProviderId(providerId);
		if (!orders || orders.length === 0) {
			return res
				.status(404)
				.json({error: "Nenhuma ordem encontrada para este prestador"});
		}
		res.json(orders);
	} catch (error) {
		res.status(500).json({error: {message: error.message}});
	}
}
export async function getTotalOrdersForProvider(req, res) {
  try {
    const providerId = req.user?.provider_id;
    if (!providerId) return res.status(401).json({ error: "Prestador não autenticado" });
    const result = await orderModel.countAllByProviderId(providerId);
    const total = Number(result.count || result['count(*)'] || 0);
    return res.status(200).json({ total });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao buscar total de ordens", details: err.message });
  }
}
export async function getPendingOrdersCountForProvider(req, res) {
	try {
		const providerId = req.user?.provider_id;
		if (!providerId) {
			return res.status(401).json({error: "Prestador não autenticado"});
		}
		const result = await orderModel.countPendingByProviderId(providerId);
		const total = Number(result.count || result["count(*)"] || 0);
		return res.status(200).json({total});
	} catch (err) {
		return res.status(500).json({
			error: "Erro ao buscar total de ordens pendentes do prestador",
			details: err.message,
		});
	}
}

export async function getPendingOrdersForProvider(req, res) {
  try {
    const providerId = req.user?.provider_id;
    if (!providerId) {
      return res.status(401).json({ error: "Prestador não autenticado" });
    }
    const orders = await orderModel.getPendingByProviderId(providerId);
    return res.status(200).json(orders);
  } catch (err) {
    return res.status(500).json({
      error: "Erro ao buscar ordens pendentes do prestador",
      details: err.message,
    });
  }
}
export async function getProviderOrderById(req, res) {
	try {
		const {id} = req.params;
		const order = await orderModel.getById(id);
		if (!order) return res.status(404).json({error: "Ordem não encontrada"});
		if (order.provider_id !== req.user?.provider_id)
			return res.status(403).json({error: "Acesso negado"});

		res.json(order);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

export async function acceptOrder(req, res) {
	try {
		const {id} = req.params;
		const order = await orderModel.getById(id);

		// Verifica se a ordem existe e se pertence ao provider autenticado
		if (!order || order.provider_id !== req.user.provider_id) {
			return res
				.status(403)
				.json({error: "Acesso negado ou ordem não encontrada"});
		}

		const updated = await orderModel.update(id, {
			status: "accepted",
			updated_at: new Date(),
		});
		res.json(updated[0]);
	} catch (error) {
		res.status(400).json({error: error.message});
	}
}

export async function rejectOrder(req, res) {
	try {
		const {id} = req.params;
		const order = await orderModel.getById(id);
		if (!order || order.provider_id !== req.user.provider_id)
			return res
				.status(403)
				.json({error: "Acesso negado ou ordem não encontrada"});

		const updated = await orderModel.update(id, {status: "rejected"});
		res.json(updated[0]);
	} catch (error) {
		res.status(400).json({error: error.message});
	}
}

export async function startOrderProgress(req, res) {
	try {
		const {id} = req.params;
		const order = await orderModel.getById(id);
		if (!order || order.provider_id !== req.user.provider_id)
			return res
				.status(403)
				.json({error: "Acesso negado ou ordem não encontrada"});

		const updated = await orderModel.update(id, {status: "in_progress"});
		res.json(updated[0]);
	} catch (error) {
		res.status(400).json({error: error.message});
	}
}

export async function completeOrder(req, res) {
	try {
		const {id} = req.params;
		const order = await orderModel.getById(id);
		if (!order || order.provider_id !== req.user.provider_id)
			return res
				.status(403)
				.json({error: "Acesso negado ou ordem não encontrada"});

		const updated = await orderModel.update(id, {
			status: "done",
			completed_at: new Date(),
		});
		res.json(updated[0]);
	} catch (error) {
		res.status(400).json({error: error.message});
	}
}

// GERAL

const validStatuses = [
	"pending",
	"accepted",
	"rejected",
	"in_progress",
	"done",
	"canceled",
];

export async function updateOrderStatus(req, res) {
	try {
		const {id} = req.params;
		const {status} = req.body;

		if (!status) {
			return res.status(400).json({error: "Status obrigatório."});
		}

		if (!validStatuses.includes(status)) {
			return res.status(400).json({
				error: "Status inválido.",
				validStatuses,
			});
		}

		// Verifica se a ordem existe antes de tentar atualizar
		const existingOrder = await orderModel.getById(id);
		if (!existingOrder) {
			return res.status(404).json({error: "Ordem não encontrada."});
		}

		// Atualiza o status da ordem
		const updated = await orderModel.update(id, {status});

		res.status(200).json({
			message: "Status da ordem atualizado com sucesso.",
			order: updated[0],
		});
	} catch (error) {
		console.error("Erro ao atualizar status da ordem:", error);
		res.status(500).json({error: "Erro interno ao atualizar a ordem."});
	}
}

export async function cancelOrder(req, res) {
	try {
		const {id} = req.params;
		const {cancel_reason} = req.body;
		if (!cancel_reason)
			return res.status(400).json({error: "Motivo obrigatório"});

		const updated = await orderModel.update(id, {
			status: "cancelled",
			cancel_reason,
			cancelled_at: new Date(),
		});
		res.json(updated[0]);
	} catch (error) {
		res.status(400).json({error: error.message});
	}
}
export async function getRatingsSummary(req, res) {
	try {
		const providerId = req.params.id || req.params.providerId;
		const summary = await reviewModel.getRatingsSummary(providerId);
		res.status(200).json(summary[0]);
	} catch (err) {
		res.status(500).json({
			error: "Erro ao gerar resumo das avaliações",
			details: err.message,
		});
	}
}
// Total de ordens finalizadas do cliente
export async function getClientFinishedOrdersCount(req, res) {
  try {
    const clientId = req.user?.id;
    const count = await orderModel.countFinishedOrdersByClient(clientId);
    res.json({ total: count });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar total de ordens finalizadas" });
  }
}

// Total de prestadores diferentes contratados pelo cliente
export async function getClientUniqueProvidersCount(req, res) {
  try {
    const clientId = req.user?.id;
    const count = await orderModel.countUniqueProvidersByClient(clientId);
    res.json({ total: count });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar total de prestadores" });
  }
}