import {FastifyRequest, FastifyReply} from "fastify";
import {UserModel} from "../models/UserModel";
import {Tables} from "knex/types/tables";
import jwt from "jsonwebtoken";
import {env} from "../env";

type User = Tables["users"];
const secret = process.env.SECRET_KEY;

export const UserController = {
	// Listar todos os usuários
	async index(req: FastifyRequest, reply: FastifyReply) {
		try {
			const users = await UserModel.findAll();
			reply.send(users);
		} catch (error) {
			reply.code(500).send({message: "Erro ao buscar usuários"});
		}
	},

	// Mostrar um único usuário
	async show(req: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply) {
		const userId = req.params.id;
		try {
			const user = await UserModel.findById(userId);
			if (!user) {
				return reply.code(404).send({message: "Usuário não encontrado"});
			}
			reply.send(user);
		} catch (error) {
			reply.code(500).send({message: "Erro ao buscar usuário"});
		}
	},

	// Criar um novo usuário
	async store(
		req: FastifyRequest<{Body: Omit<User, "id"> & {senha: string}}>,
		reply: FastifyReply
	) {
		const {senha, ...userData} = req.body;
		if (!senha) return reply.code(400).send({message: "Senha é obrigatória"});

		try {
			const [id] = await UserModel.create({...userData, senha});
			reply.code(201).send({id});
		} catch (error) {
			reply.code(500).send({message: "Cpf já cadastrado"});
		}
	},

	// Atualizar um usuário
	async update(
		req: FastifyRequest<{
			Params: {id: string};
			Body: Partial<Omit<User, "id">>;
		}>,
		reply: FastifyReply
	) {
		const userId = req.params.id;
		try {
			const updated = await UserModel.update(userId, req.body);
			if (!updated) {
				return reply.code(404).send({message: "Usuário não encontrado"});
			}
			reply.send({message: "Usuário atualizado com sucesso"});
		} catch (error) {
			reply.code(500).send({message: "Erro ao atualizar usuário"});
		}
	},

	// Deletar um usuário
	async destroy(
		req: FastifyRequest<{Params: {id: string}}>,
		reply: FastifyReply
	) {
		const userId = req.params.id;
		try {
			const deleted = await UserModel.delete(userId);
			if (!deleted) {
				return reply.code(404).send({message: "Usuário não encontrado"});
			}
			reply.send({message: "Usuário deletado com sucesso"});
		} catch (error) {
			reply.code(500).send({message: "Erro ao deletar usuário"});
		}
	},

	// Login de usuário
	async login(
		req: FastifyRequest<{Body: {email: string; senha: string}}>,
		reply: FastifyReply
	) {
		const {email, senha} = req.body;

		if (!email || !senha) {
			return reply.code(400).send({message: "Email e senha são obrigatórios"});
		}

		try {
			const user = await UserModel.checkLogin(email, senha);

			if (!user) {
				return reply.code(401).send({message: "Credenciais inválidas"});
			}

			const token = jwt.sign(
				{id_usuario: user.valueOf, email: user.valueOf},
				env.JWT_SECRET,
				{expiresIn: "1h"}
			);

			return reply.send({token});
		} catch (error) {
			console.error(error);
			reply.code(500).send({message: "Erro ao fazer login"});
		}
	},
};
