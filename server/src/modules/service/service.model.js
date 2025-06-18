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
export  function getServiceById(id) {
	return db("services").where({id}).first();
}
export async function getAllService(id) {
	return db("services").where({});
}

export async function getAllServicesByProviderId(providerId) {
	return db("services").where({provider_id: providerId});
}
export async function getAllServicesByCategoryName(categoryName) {
	return db("services")
		.join("categories", "services.category_id", "categories.id")
		.select("services.*")
		.where("categories.name", categoryName);
}

export function getById(id) {
  return db("services").where({ id }).first();
}
