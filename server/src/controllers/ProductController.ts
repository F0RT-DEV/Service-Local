import {FastifyRequest, FastifyReply} from "fastify";
import {ProductModel} from "../models/ProductModel";
import {Tables} from "knex/types/tables";
import {error} from "console";

type Product = Tables["products"];
export const ProductController = {
	async index(req: FastifyRequest, reply: FastifyReply) {
		try {
			const products = await ProductModel.findAll();
			reply.send(products);
		} catch (error) {
			reply.code(500).send({message: "Erro ao buscar produtos"});
		}
	},
	async show(req: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply) {
		const productId = req.params.id;
		try {
			const product = await ProductModel.findById(productId);
			if (!product) {
				return reply.code(404).send({message: "Produto não encontrado"});
			}
			reply.send(product);
		} catch (error) {
			reply.code(500).send({error});
		}
	},
	async store(
		req: FastifyRequest<{Body: Omit<Product, "id">}>,
		reply: FastifyReply
	) {
		if (!req.body.image) {
			return reply.code(400).send({error: "Imagem é obrigatória"});
		}
		try {
			const {...productData} = req.body;
			const [id] = await ProductModel.create({...productData});
			reply.code(201).send({id});
		} catch (error) {
			console.error("Erro ao criar produto:", error); // Logando erro no servidor
			reply.code(500).send({message: "Erro ao criar produto", error});
		}
	},
	async update(
		req: FastifyRequest<{
			Params: {id: string};
			Body: Partial<Omit<Product, "id">>;
		}>,
		reply: FastifyReply
	) {
		const productId = req.params.id;
		try {
			const updated = await ProductModel.update(productId, req.body);
			if (!updated) {
				return reply.code(404).send({message: "Produto não encontrado"});
			}
			reply.send({message: "Produto atualizado com sucesso"});
		} catch (error) {
			reply.code(500).send({message: "Erro ao atualizar produto"});
		}
	},
	async destroy(
		req: FastifyRequest<{Params: {id: string}}>,
		reply: FastifyReply
	) {
		const productId = req.params.id;
		try {
			const deleted = await ProductModel.delete(productId);
			if (!deleted) {
				return reply.code(404).send({message: "Produto não encontrado"});
			}
			reply.send({message: "Produto deletado com sucesso"});
		} catch (error) {
			reply.code(500).send({message: "Erro ao deletar produto"});
		}
	},
};
