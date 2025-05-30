import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
import * as userModel from "../models/User/users.model.js";
import * as providerModel from "../models/Providers/provider.model.js";

export async function createUser(req, res) {
	try {
		const result = createUserSchema.safeParse(req.body);
		if (!result.success) {
			return res.status(400).json({
				error: "Dados inválidos",
				details: result.error.format(),
			});
		}

		const {
			name,
			email,
			password,
			phone,
			role = "client",
			cep,
			logradouro,
			complemento,
			bairro,
			localidade,
			uf,
			numero,
		} = result.data;

		// Verifica se o usuário já existe
		const existingUser = await userModel.getByEmail(email);
		if (existingUser) {
			return res.status(409).json({error: "Email já cadastrado"});
		}

		const passwordHash = await bcrypt.hash(password, 10);
		const userId = uuidv4();

		await userModel.create({
			id: userId,
			name,
			email,
			password_hash: passwordHash,
			phone,
			role,
			cep,
			logradouro,
			complemento,
			bairro,
			localidade,
			uf,
			numero,
		});

		if (role === "provider") {
			await providerModel.create({
				user_id: userId,
				status: "pending", // Status inicial padrão
			});
		}

		res.status(201).json({
			message: "Usuário criado com sucesso!",
			user_id: userId,
			role,
		});
	} catch (error) {
		console.error("Erro ao criar usuário:", error);
		res.status(500).json({
			error: "Erro interno do servidor",
			details: error.message,
		});
	}
}

export async function getUsers(req, res) {
	try {
		const users = await userModel.getAll();
		res.status(200).json(users);
	} catch (error) {
		console.error("Erro ao buscar usuários:", error);
		res.status(500).json({
			error: "Erro ao buscar usuários",
			details: error.message,
		});
	}
}

export async function getUserById(req, res) {
	const {id} = req.params;
	try {
		const user = await userModel.getById(id);
		if (!user) {
			return res.status(404).json({error: "Usuário não encontrado"});
		}
		res.status(200).json(user);
	} catch (error) {
		console.error("Erro ao buscar usuário:", error);
		res.status(500).json({
			error: "Erro ao buscar usuário",
			details: error.message,
		});
	}
}
