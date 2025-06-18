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

export function remove(id) {
	return db("orders").where({id}).del();
}

export function getByProviderId(provider_id) {
    return db("orders").where({ provider_id });
}

export function getByClientId(client_id) {
    return db("orders").where({ client_id });
}

