import db from "../db.js";
import { v4 as uuidv4 } from "uuid";

export function getAll() {
  return db("providers");
}

export function getById(id) {
  return db("providers").where({ id }).first();
}

export function getByUserId(user_id) {
  return db("providers").where({ user_id }).first();
}

export function create(data) {
  const id = uuidv4();
  return db("providers").insert({ id, ...data });
}

export function updateByUserId(user_id, updates) {
  return db("providers").where({ user_id }).update(updates);
}

export function addCategories(providerId, categoryIds) {
  const rows = categoryIds.map(category_id => ({
    provider_id: providerId,
    category_id
  }));
  return db("providers_categories").insert(rows);
}
export async function getAllWithCategories() {
  const rows = await db("providers as p")
    .leftJoin("providers_categories as pc", "p.id", "pc.provider_id")
    .leftJoin("categories as c", "pc.category_id", "c.id")
    .select(
      "p.id as provider_id",
      "p.user_id",
      "p.bio",
      "p.cnpj",
      "p.status",
      "c.id as category_id",
      "c.name as category_name"
    );

  const providersMap = new Map();

  rows.forEach(row => {
    if (!providersMap.has(row.provider_id)) {
      providersMap.set(row.provider_id, {
        id: row.provider_id,
        user_id: row.user_id,
        bio: row.bio,
        cnpj: row.cnpj,
        status: row.status,
        categories: []
      });
    }
    if (row.category_id) {
      providersMap.get(row.provider_id).categories.push({
        id: row.category_id,
        name: row.category_name
      });
    }
  });

  return Array.from(providersMap.values());
}
export async function getByIdWithCategories(id) {
  const rows = await db("providers as p")
    .leftJoin("providers_categories as pc", "p.id", "pc.provider_id")
    .leftJoin("categories as c", "pc.category_id", "c.id")
    .select(
      "p.id as provider_id",
      "p.user_id",
      "p.bio",
      "p.cnpj",
      "p.status",
      "c.id as category_id",
      "c.name as category_name"
    )
    .where("p.id", id);

  if (rows.length === 0) return null;

  const provider = {
    id: rows[0].provider_id,
    user_id: rows[0].user_id,
    bio: rows[0].bio,
    cnpj: rows[0].cnpj,
    status: rows[0].status,
    categories: []
  };

  rows.forEach(row => {
    if (row.category_id) {
      provider.categories.push({
        id: row.category_id,
        name: row.category_name
      });
    }
  });

  return provider;
}