import db from "../../db.js";
import {v4 as uuidv4} from "uuid";

// Basic CRUD operations
export function getAll() {
	return db("providers");
}

export function getById(id) {
	return db("providers").where({id}).first();
}

export function getByUserId(user_id) {
	return db("providers").where({user_id}).first();
}

export function create(data) {
	const id = uuidv4();
	return db("providers").insert({id, ...data});
}

export function updateByUserId(user_id, updates) {
	const allowedFields = ["bio", "cnpj", "areas_of_expertise", "availability"];

	const filteredUpdates = Object.keys(updates)
		.filter((key) => allowedFields.includes(key) && updates[key] !== undefined)
		.reduce((obj, key) => {
			obj[key] = updates[key];
			return obj;
		}, {});

	return db("providers").where({user_id}).update(filteredUpdates);
}

// Category-related operations
export function addCategories(providerId, categoryIds) {
	const rows = categoryIds.map((category_id) => ({
		provider_id: providerId,
		category_id,
	}));
	return db("providers_categories").insert(rows);
}

// Complex queries with categories
export async function getAllWithCategories() {
	try {
		const providers = await db("providers").select(
			"id as provider_id",
			"user_id",
			"bio",
			"cnpj",
			"status",
			"availability"
		);

		if (providers.length === 0) return [];

		const categories = await db("providers_categories as pc")
			.join("categories as c", "pc.category_id", "c.id")
			.select(
				"pc.provider_id",
				"c.id as category_id",
				"c.name as category_name"
			);

		return providers.map((provider) => ({
			...provider,
			categories: categories
				.filter((c) => c.provider_id === provider.provider_id)
				.map(({category_id, category_name}) => ({
					id: category_id,
					name: category_name,
				})),
		}));
	} catch (error) {
		console.error("Error in getAllWithCategories:", error);
		throw error;
	}
}

export async function getByIdWithCategories(id) {
	try {
		const provider = await db("providers")
			.where("id", id)
			.select(
				"id as provider_id",
				"user_id",
				"bio",
				"cnpj",
				"status",

				"availability"
			)
			.first();

		if (!provider) return null;

		const categories = await db("providers_categories as pc")
			.join("categories as c", "pc.category_id", "c.id")
			.where("pc.provider_id", id)
			.select("c.id as category_id", "c.name as category_name");

		return {
			...provider,
			categories: categories.map(({category_id, category_name}) => ({
				id: category_id,
				name: category_name,
			})),
		};
	} catch (error) {
		console.error("Error in getByIdWithCategories:", error);
		throw error;
	}
}

export function getInformactionsMe(id) {
	return db("providers").where({id}).first();
}

export function getByProviderByCategory(categoryId) {
	return db("providers_categories as pc")
		.join("providers as p", "pc.provider_id", "p.id")
		.where("pc.category_id", categoryId)
		.select(
			"p.id as provider_id",
			"p.user_id",
			"p.bio",
			"p.cnpj",
			"p.status",
			"p.availability"
		);
}
export function getRatingsByProviderId(providerId) {
	return db("orders")
		.where({ provider_id: providerId })
		.whereNotNull("rating")
		.select("rating", "rating_comment", "created_at", "client_id");
}

export function getRatingsSummary(providerId) {
	return db("orders")
		.where({ provider_id: providerId })
		.whereNotNull("rating")
		.avg("rating as average_rating")
		.count("rating as total_reviews")
		.first();
}
