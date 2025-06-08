import db from "../../db.js";

export function create(category) {
	return db("categories").insert(category);
}

export function getAll() {
	return db("categories").select("*");
}

export function getByName(name) {
	return db("categories").where({name}).first();
}
