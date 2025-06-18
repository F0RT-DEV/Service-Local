	import db from "../../db.js";

	// Criação da ordem
	export function create(order) {
		return db("orders").insert(order);
	}

	// Listar todas (geral, normalmente uso interno ou admin)
	export function getAll() {
		return db("orders").select("*");
	}

	// Buscar por ID
	export function getById(id) {
		return db("orders").where({ id }).first();
	}

	// Atualizar por ID
	export function update(id, data) {
		return db("orders").where({ id }).update(data).returning("*");
	}

	// Deletar (geralmente não recomendado, mas está aqui se necessário)
	export function remove(id) {
		return db("orders").where({ id }).del();
	}

	// Buscar ordens de um cliente específico
	export function getByClient(client_id) {
		return db("orders").where({ client_id }).select("*").orderBy("created_at", "desc");
	}

	// Buscar ordens de um prestador específico
	export function getByProvider(provider_id) {
		return db("orders").where({ provider_id }).select("*").orderBy("created_at", "desc");
	}
