import bcrypt from "bcrypt";
import * as userModel from "../models/users.model.js";
import {createUserSchema} from "../schemas/user.schema.js";

export async function getUsers(req, res) {
	try {
		const users = await userModel.getAll();
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({error: "Erro interno do servidor"});
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
		res.status(500).json({error: "Erro interno do servidor"});
	}
}

export async function createUser(req, res) {
	try {
		// ✅ Validação com Zod
		const result = createUserSchema.safeParse(req.body);

		if (!result.success) {
			const errors = result.error.format();
			return res.status(400).json({error: "Dados inválidos", details: errors});
		}

		const {
			name,
			email,
			password,
			phone,
			role,
			cep,
			logradouro,
			complemento,
			bairro,
			localidade,
			uf,
			numero,
		} = result.data;

		const passwordHash = await bcrypt.hash(password, 10);

		await userModel.create({
			name,
			email,
			password_hash: passwordHash,
			phone,
			role: role || "client",
			cep,
			logradouro,
			complemento,
			bairro,
			localidade,
			uf,
			numero,
		});

		res.status(201).json({message: "Usuário criado com sucesso!"});
	} catch (error) {
		if (error.code === "ER_DUP_ENTRY") {
			return res.status(409).json({error: "Email já cadastrado"});
		}
		res.status(500).json({error});
	}
}
