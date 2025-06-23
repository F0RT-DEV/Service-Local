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
// filepath: server/src/modules/service/service.model.js
export function getServiceById(id) {
	return db("services")
		.leftJoin("categories", "services.category_id", "categories.id")
		.select(
			"services.*",
			"categories.name as category_title" // <-- aqui está o ajuste!
		)
		.where("services.id", id)
		.first();
}
export async function getAllService(id) {
	return db("services").where({});
}

export async function getAllServicesByProviderId(providerId) {
    return db("services")
        .leftJoin("categories", "services.category_id", "categories.id")
        .select(
            "services.*",
            "categories.name as category_title"
        )
        .where("services.provider_id", providerId);
}

export async function getAllServicesByCategoryName(categoryName) {
	return db("services")
		.join("categories", "services.category_id", "categories.id")
		.select("services.*")
		.where("categories.name", categoryName);
}

export function getById(id) {
	return db("services").where({id}).first();
}
// service.model.js
export function countAllServicesByProviderId(provider_id) {
	return db("services").where({provider_id}).count().first();
}
export async function updateService(id, data) {
  // Filtra apenas os campos válidos
  const allowed = ["title", "description", "price_min", "price_max"];
  const updateData = {};
  for (const key of allowed) {
    if (data[key] !== undefined) updateData[key] = data[key];
  }
  updateData.updated_at = new Date();
  await db("services").where({ id }).update(updateData);
}