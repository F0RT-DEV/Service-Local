import db from "../../db.js";

export function create(order) {
	return db("orders").insert(order);
}

export function getAll() {
	return db("orders").select("*");
}

export function getById(id) {
	return db("orders").where({id}).first();
}

export function update(id, order) {
	return db("orders").where({id}).update(order).returning("*");
}

export function remove(id) {
	return db("orders").where({id}).del();
}
