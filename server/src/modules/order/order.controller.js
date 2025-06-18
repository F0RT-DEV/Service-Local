import {v4 as uuidv4} from "uuid";
import * as orderModel from "./order.model.js";
import * as serviceModel from "../service/service.model.js";
import {CreateOrderSchema} from "./order.schema.js";

// CLIENTES

export async function createOrder(req, res) {
	try {
		const validated = CreateOrderSchema.parse(req.body);
		const id = uuidv4();
		const client_id = req.user.id;

		// Buscar provider_id do serviço
		const service = await serviceModel.getById(validated.service_id);
		if (!service || !service.provider_id) {
			return res.status(400).json({ error: "Serviço inválido ou sem prestador" });
		}
		const provider_id = service.provider_id;


		const order = {
			...validated,
			id,
			client_id,
			provider_id,
			category_id: service.category_id,
			status: "pending",
			created_at: new Date(),
		};

		await orderModel.create(order);
		res.status(201).json(order);
	} catch (error) {
		console.error("Erro ao criar ordem:", error);
		res.status(400).json({ error: error.errors || error.message });
	}
}


export async function getClientOrders(req, res) {
	try {
		const client_id = req.user.id;
		const orders = await orderModel.getByClient(client_id);
		res.json(orders);
	} catch (error) {
		res.status(500).json({error: "Erro ao listar ordens"});
	}
}

export async function getClientOrderById(req, res) {
	try {
		const {id} = req.params;
		const order = await orderModel.getById(id);
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

		const updated = await orderModel.update(id, {
			status: "cancelled",
			cancelled_at: new Date(),
			cancel_reason: "Cancelado pelo cliente",
		});

		res.json(updated[0]);
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

		if (order.status !== "completed")
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
		const orders = await orderModel.getByProvider(providerId);
		res.json(orders);
	} catch (error) {
		res.status(500).json({error: "Erro ao listar ordens"});
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
		if (!order || order.provider_id !== req.user.id)
			return res
				.status(403)
				.json({error: "Acesso negado ou ordem não encontrada"});

		const updated = await orderModel.update(id, {status: "accepted"});
		res.json(updated[0]);
	} catch (error) {
		res.status(400).json({error: error.message});
	}
}

export async function rejectOrder(req, res) {
	try {
		const {id} = req.params;
		const order = await orderModel.getById(id);
		if (!order || order.provider_id !== req.user.id)
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
		if (!order || order.provider_id !== req.user.id)
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
		if (!order || order.provider_id !== req.user.id)
			return res
				.status(403)
				.json({error: "Acesso negado ou ordem não encontrada"});

		const updated = await orderModel.update(id, {
			status: "completed",
			completed_at: new Date(),
		});
		res.json(updated[0]);
	} catch (error) {
		res.status(400).json({error: error.message});
	}
}

// GERAL

export async function updateOrderStatus(req, res) {
	try {
		const {id} = req.params;
		const {status} = req.body;
		if (!status) return res.status(400).json({error: "Status obrigatório"});

		const updated = await orderModel.update(id, {status});
		res.json(updated[0]);
	} catch (error) {
		res.status(400).json({error: error.message});
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
