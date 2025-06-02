import bcrypt from "bcryptjs"; // Confirme se está correto
import {v4 as uuidv4} from "uuid";
import * as userModel from "../models/users.model.js";
import * as providerModel from "../models/provider.model.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

import {UserSchema} from "../schemas/userSchema.js"; // Corrigido o caminho!

export async function createUser(req, res) {
	try {
		const result = UserSchema.safeParse(req.body);
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

		// Verifica se o e-mail já está em uso
		const existingUser = await userModel.getByEmail(email);
		if (existingUser) {
			return res.status(409).json({error: "Email já cadastrado"});
		}

		// Criptografa a senha
		const passwordHash = await bcrypt.hash(password, 10);
		const userId = uuidv4();

		// Cria o usuário no banco
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
			created_at: new Date(),
			updated_at: new Date(),
		});

		// Se for prestador de serviço, cria a relação com provider
		if (role === "provider") {
			await providerModel.create({
				user_id: userId,
				status: "pending",
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
export async function loginUser(req, res) {
	try {
		const {email, password} = req.body;

		// Validação dos dados de entrada
		const result = UserSchema.pick({email: true, password: true}).safeParse(
			req.body
		);
		if (!result.success) {
			return res.status(400).json({
				error: "Dados inválidos",
				details: result.error.format(),
			});
		}

		// Busca o usuário pelo email
		const user = await userModel.getByEmail(email);
		if (!user) {
			return res.status(401).json({error: "Credenciais inválidas"});
		}

		// Verifica a senha
		const validPassword = await bcrypt.compare(password, user.password_hash);
		if (!validPassword) {
			return res.status(401).json({error: "Credenciais inválidas"});
		}

		// Gera o token JWT
		const token = jwt.sign(
			{id: user.id, role: user.role},
			process.env.JWT_SECRET,
			{expiresIn: "1h"}
		);

		res.json({
			message: "Login realizado com sucesso!",
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		console.error("Erro ao realizar login:", error);
		res.status(500).json({
			error: "Erro interno do servidor",
			details: error.message,
		});
	}
}
