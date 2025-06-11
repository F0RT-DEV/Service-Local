import db from "../../db.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secreta123"; // Substitua por uma variável de ambiente segura

export function getAll() {
	return db("users").select(
		"id",
		"name",
		"email",
		"phone",
		"role",
		"cep",
		"logradouro",
		"complemento",
		"bairro",
		"localidade",
		"uf",
		"numero",
		"created_at"
	);
}

export function getById(id) {
	return db("users")
		.where({ id })
		.select(
			"id",
			"name",
			"email",
			"phone",
			"role",
			"cep",
			"logradouro",
			"complemento",
			"bairro",
			"localidade",
			"uf",
			"numero",
			"created_at"
		)
		.first();
}

export function getByEmail(email) {
	return db("users").where({ email }).first();
}

export async function create(user) {
	const id = uuidv4();

	// Criptografar a senha antes de salvar
	if (user.password) {
		const saltRounds = 10;
		user.password = await bcrypt.hash(user.password, saltRounds);
	}

	return db("users").insert({ id, ...user });
}

export function update(id, updates) {
	const allowedFields = [
		"name",
		"phone",
		"cep",
		"logradouro",
		"complemento",
		"bairro",
		"localidade",
		"uf",
		"numero",
	];

	const filteredUpdates = Object.keys(updates)
		.filter((key) => allowedFields.includes(key) && updates[key] !== undefined)
		.reduce((obj, key) => {
			obj[key] = updates[key];
			return obj;
		}, {});

	return db("users").where({ id }).update(filteredUpdates);
}

export function remove(id) {
	return db("users").where({ id }).del();
}

export async function login(email, senha) {
	try {
		const user = await getByEmail(email);

		if (!user) {
			return { error: "Usuário não encontrado" };
		}

		const senhaValida = await bcrypt.compare(senha, user.password);
		if (!senhaValida) {
			return { error: "Senha inválida" };
		}

		const { password, ...userSemSenha } = user;

		const token = jwt.sign(
			{ id: user.id, role: user.role },
			JWT_SECRET,
			{ expiresIn: "1h" }
		);

		return { token, user: userSemSenha };
	} catch (err) {
		console.error(err);
		return { error: "Erro no login" };
	}
}
