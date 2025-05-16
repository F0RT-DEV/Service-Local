import {Tables} from "knex/types/tables";
import {db} from "../database"; // Ajuste o caminho conforme necessário

export type Categories = Tables["categories"]; // Usando o tipo já definido no Knex

export const CategoriesModel = {
	// Buscar todas as categorias
	async findAll(): Promise<Categories[]> {
		return db("categories").select("*");
	},

	// Buscar uma categoria por ID
	async findById(id: string): Promise<Categories | null> {
		const category = await db("categories").where("id", id).first();
		return category || null;
	},

	// Criar uma nova categoria
	async create(category: Omit<Categories, "id">): Promise<string[]> {
		const [id] = await db("categories").insert(category);
		return [id.toString()];
	},

	// Atualizar uma categoria
	async update(
		id: string,
		category: Partial<Omit<Categories, "id">>
	): Promise<boolean> {
		const result = await db("categories").where("id", id).update(category);
		return result > 0;
	},

	// Deletar uma categoria
	async delete(id: string): Promise<boolean> {
		const result = await db("categories").where("id", id).delete();
		return result > 0;
	},
};
