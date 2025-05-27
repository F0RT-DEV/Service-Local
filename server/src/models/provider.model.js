import {v4 as uuidv4} from "uuid";
import db from "../db.js";

export function getAll() {
	return db("providers");
}

 export function getById(id) {
	return db("providers").where({id}).first();
}