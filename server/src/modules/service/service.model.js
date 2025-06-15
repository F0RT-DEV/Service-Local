import db from "../../db.js";
import {v4 as uuidv4} from "uuid";

export async function createService(data) {
	const id = uuidv4();

	await db("services").insert({
		id,
		...data,
	});

	const newService = await db("services").where({id}).first();
	return newService;
}
export async function getServiceById(id) {
	return db("services").where({id}).first();
}
export async function getAllService(id) {
	returndb("services")
		.join("categories", "services.category_id", "=", "categories.id")
		.select(
			"services.*",
			"categories.name as category_name" // <- campo adicional
		);
}

export async function getAllServicesByProviderId(providerId) {
	return db("services").where({provider_id: providerId});
}
export async function getAllServicesByCategory(id) {
	return db("services").where({category_id: id});
}
