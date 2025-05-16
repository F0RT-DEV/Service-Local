import knex from "knex"; // Ajuste o caminho conforme necessário
import {Tables} from "knex/types/tables";
import {db} from "../database"; // Ajuste o caminho conforme necessário
import {randomUUID} from "crypto";

export type Product = Tables["products"]; // Usando o tipo já definido no Knex

export const ProductModel = {
	// Buscar todos os produtos
	async findAll(): Promise<Product[]> {
		return db("products").select("*");
	},

	// Buscar um produto por ID
	async findById(id: string): Promise<Product | null> {
		const product = await db("products").where("id", id).first();
		return product || null;
	},

	// Criar um novo produto
	async create(
		product: Omit<Product, "id" | "nome" | "preço" |"data_anuncio" | "usuario_id" | "categories_id" | "image" | "descricao">
	): Promise<string[]> {
		const id = randomUUID();
		


		await db("products").insert({id, ...product});
		return [id];
	},

	// Atualizar um produto
	async update(
		id: string,
		product: Partial<Omit<Product, "id">>
	): Promise<boolean> {
		const result = await db("products").where("id", id).update(product);
		return result > 0;
	},

	// Deletar um produto
	async delete(id: string): Promise<boolean> {
		const result = await db("products").where("id", id).delete();
		return result > 0;
	},
};
