import db from "../../db.js";

// Criação da ordem
export function create(order) {
	return db("orders").insert(order);
}

// Listar todas (geral, normalmente uso interno ou admin)
// export function getAll() {
// 	return db("orders").select("*");
// }
export function getAll() {
  return db("orders")
    .leftJoin("users as client", "orders.client_id", "client.id")
    .leftJoin("providers", "orders.provider_id", "providers.id")
    .leftJoin("users as provider", "providers.user_id", "provider.id")
    .select(
      "orders.*",
      "client.name as client_name",
      "provider.name as provider_name"
    );
}
// order.model.js
export function countAllByProviderId(provider_id) {
  return db("orders")
    .where({ provider_id })
    .count()
    .first();
}
export function countPendingByProviderId(provider_id) {
  return db("orders")
    .where({ provider_id, status: "pending" })
    .count()
    .first();
}
export function getPendingByProviderId(provider_id) {
  return db("orders")
    .select(
      "orders.id",
      "orders.scheduled_date",
      "orders.notes",
      "orders.status",
      "orders.service_id",
      "orders.client_id",
      "orders.address",
      "services.title as service_name",
      "users.name as client_name"
    )
    .join("services", "orders.service_id", "services.id")
    .join("users", "orders.client_id", "users.id")
    .where("orders.provider_id", provider_id)
    .andWhere("orders.status", "pending")
    .orderBy("orders.created_at", "desc");
}
export function getByProviderId(provider_id) {
	return db("orders")
		.select(
			"orders.*",
			"services.title as service_name",
			"users.name as client_name"
		)
		.join("services", "orders.service_id", "services.id")
		.join("users", "orders.client_id", "users.id")
		.where("orders.provider_id", provider_id)
		.orderBy("orders.created_at", "desc");
}

// Atualizar por ID
export function update(id, data) {
	return db("orders").where({id}).update(data);
}

export function remove(id) {
	return db("orders").where({id}).del();
}


// export function getByClientId(client_id) {
// 	return db("orders").where({client_id});
// }
export function getByClientId(client_id) {
  return db("orders")
    .select(
      "orders.*",
      "services.title as service_name",
      "users.name as provider_name"
    )
    .join("services", "orders.service_id", "services.id")
    .join("providers", "orders.provider_id", "providers.id")
    .join("users", "providers.user_id", "users.id")
    .where("orders.client_id", client_id)
    .orderBy("orders.created_at", "desc");
}

// export function getById(id) {
// 	return db("orders").where({ id }).first();
// }
export function getById(id) {
  return db("orders")
    .select(
      "orders.*",
      "services.title as service_name",
      "users.name as provider_name"
    )
    .join("services", "orders.service_id", "services.id")
    .join("providers", "orders.provider_id", "providers.id")
    .join("users", "providers.user_id", "users.id")
    .where("orders.id", id)
    .first();
}

export function findActiveByClientId(client_id) {
	return db("orders")
		.where({ client_id })
		.whereIn("status", ["pending", "accepted"])
		.first(); // retorna a primeira encontrada
}
export function countFinishedOrdersByClient(clientId) {
  return db('orders')
    .where({ client_id: clientId, status: 'done' })
    .count('id as total')
    .first()
    .then(res => Number(res.total) || 0);
}

// Conta prestadores diferentes já contratados pelo cliente
export function countUniqueProvidersByClient(clientId) {
  return db('orders')
    .where({ client_id: clientId })
    .distinct('provider_id')
    .countDistinct('provider_id as total')
    .first()
    .then(res => Number(res.total) || 0);
}