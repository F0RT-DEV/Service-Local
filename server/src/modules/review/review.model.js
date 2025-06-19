import db from "../../db.js";

// Buscar todas as avaliações de um prestador
export function getReviewsByProviderId(providerId) {
	return db("orders")
		.select("rating", "rating_comment", "client_id", "created_at")
		.where({ provider_id: providerId })
		.whereNotNull("rating")
		.andWhere("status", "done") 
		.orderBy("created_at", "desc");
}

// Obter resumo das avaliações (média e total)
export function getRatingsSummary(providerId) {
	return db("orders")
		.where({ provider_id: providerId })
		.whereNotNull("rating")
		.andWhere("status", "done")
		.avg("rating as average_rating")
		.count("rating as total_reviews");
}

export function getAllReviewsForAdmin() {
	return db("orders")
		.leftJoin("users as c", "orders.client_id", "c.id")
		.leftJoin("providers as p", "orders.provider_id", "p.id")
		.select(
			"orders.id as order_id",
			"orders.rating",
			"orders.rating_comment",
			"orders.created_at",
			"c.name as user_name"
			// "p.name as provider_name" // <-- comentar por enquanto
		)
		.whereNotNull("orders.rating");
}
