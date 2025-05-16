import knex from "knex"; // Ajuste o caminho conforme necessário
import {Tables} from "knex/types/tables";
import {db} from "../database"; // Ajuste o caminho conforme necessário
import {randomUUID} from "crypto";
import bcrypt from "bcryptjs"; // Importando bcrypt para criptografar senhas

export type User = Tables["users"]; // Usando o tipo já definido no Knex

export const UserModel = {
	// Buscar todos os usuários
	async findAll(): Promise<User[]> {
		return db("users").select("*");
	},

	// Buscar um usuário por ID
	async findById(id: string): Promise<User | null> {
		const user = await db("users").where("id", id).first();
		return user || null;
	},

	// Criar um novo usuário
	async create(user: Omit<User, "id">): Promise<string[]> {
		const id = randomUUID();

		// Criptografar a senha
		const senha = await bcrypt.hash(user.senha ?? "", 10);
		// Substituir a senha no objeto
		await db("users").insert({id, ...user, senha});

		return [id.toString()];
	},

	// Atualizar um usuário
	async update(id: string, user: Partial<Omit<User, "id">>): Promise<boolean> {
		const result = await db("users").where("id", id).update(user);
		return result > 0;
	},

	// Deletar um usuário
	async delete(id: string): Promise<boolean> {
		const result = await db("users").where("id", id).delete();
		return result > 0;
	},

	// Verificar se o login é válido
	async checkLogin(email: string, senha: string): Promise<boolean> {
		const user = await db("users").where("email", email).first();
		if (user && user.senha === senha) {
			return true;
		}
		return false;
	},
};
