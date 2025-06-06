import db from "../../db.js";
import { v4 as uuidv4 } from "uuid";

export async function createService(data) {
  const id = uuidv4();
  await db('services').insert({
    id,
    ...data
  });
  const newService = await db('services').where({ id }).first();
  return newService;
}
export async function getServiceById(id) {
  return db('services').where({ id }).first();
}
export async function getAllService(id) {
  return db('services').where({  })
}
