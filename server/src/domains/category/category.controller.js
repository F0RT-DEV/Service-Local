import {v4 as uuidv4} from "uuid";
import * as categoryModel from "./category.model.js";

export async function createCategory(req, res) {
	const {name} = req.body;

	try {
		if (!name) {
			return res.status(400).json({error: "Nome da categoria é obrigatório"});
		}

		const existing = await categoryModel.getByName(name);
		if (existing) {
			return res.status(409).json({error: "Categoria já existe"});
		}

		const id = uuidv4(); // 🔹 gera UUID

		await categoryModel.create({id, name});

		res.status(201).json({id, name});
	} catch (error) {
		res.status(500).json({error});
	}
}

export async function getAllCategories(req, res) {
	try {
		const categories = await categoryModel.getAll();
		res.status(200).json(categories);
	} catch (error) {
		res.status(500).json({error: "Erro ao listar categorias"});
	}
}
