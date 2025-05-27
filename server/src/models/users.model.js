import {v4 as uuidv4} from "uuid";
import db from "../db.js";

export function getAll() {
	return db("users");
} 

export function getById(id) {
	return db("users").where({id}).first();
}

export function create(user) {
	const id = uuidv4();
	return db("users").insert({id, ...user});
}
export function addPrestador(user) {
	const id = uuidv4();
	return db("providers").insert({id, ...user});
}
