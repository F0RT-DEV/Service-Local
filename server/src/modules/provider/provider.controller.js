import db from "../../db.js";
import * as providerModel from "./provider.model.js";

export async function updateProvider(req, res) {
	const userId = req.user.id;
	const {bio, categories, cnpj, areas_of_expertise, } = req.body;

	try {
		if (!bio && !cnpj && !categories ) {
			return res
				.status(400)
				.json({error: "Nenhum dado válido para atualização"});
		}

		// Atualiza os dados básicos do provider
		await providerModel.updateByUserId(userId, {
			bio,
			cnpj,
			areas_of_expertise,
			
		});

		const provider = await providerModel.getByUserId(userId);
		if (!provider) {
			return res.status(404).json({error: "Prestador não encontrado"});
		}

		// Atualiza categorias
		if (Array.isArray(categories)) {
			await db("providers_categories").where({provider_id: provider.id}).del();
			if (categories.length > 0) {
				await providerModel.addCategories(provider.id, categories);
			}
		}

		res.status(200).json({
			message: "Prestador atualizado com sucesso!",
			provider_id: provider.id,
		});
	} catch (error) {
		console.error("Erro ao atualizar prestador:", error);

		if (error.code === "ER_NO_REFERENCED_ROW_2") {
			return res.status(404).json({error: "Usuário não encontrado"});
		}

		res.status(500).json({
			error: "Erro interno do servidor",
			details: error.message,
		});
	}
}

export async function getPrestadores(req, res) {
	try {
		const prestadores = await providerModel.getAllWithCategories();

		// Filtra apenas os prestadores aprovados
		const aprovados = prestadores.filter((p) => p.status === "approved");

		res.status(200).json(aprovados);
	} catch (error) {
		console.error("Erro ao buscar prestadores:", error);
		res.status(500).json({
			error: "Erro ao buscar prestadores",
			details: error.message,
		});
	}
}

export async function getPrestadorById(req, res) {
	const {id} = req.params;
	try {
		const prestador = await providerModel.getByIdWithCategories(id);

		if (!prestador) {
			return res.status(404).json({message: "Prestador não encontrado"});
		}

		// Verifica se o prestador está aprovado
		if (prestador.status !== "approved") {
			return res.status(403).json({
				error: "Prestador não autorizado a exibir informações públicas.",
			});
		}

		res.status(200).json(prestador);
	} catch (error) {
		console.error("Erro ao buscar prestador por ID:", error);
		res.status(500).json({
			error: "Erro ao buscar prestador",
			details: error.message,
		});
	}
}

export async function getAuthenticatedProfile(req, res) {
	const { id, role } = req.user;

	try {
		const user = await db("users").where({ id }).first();
		if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

		if (role === "client" || role === "user" || role === "admin") {
			return res.status(200).json({ role, user });
		}

		if (role === "provider") {
			const provider = await db("providers")
				// Removido o campo "availability"
				.select("id", "user_id", "bio", "cnpj", "status")
				.where({ user_id: id })
				.first();

			if (!provider)
				return res.status(404).json({ error: "Prestador não encontrado" });

			// Buscar categorias associadas ao provider
			const categories = await db("providers_categories")
				.join("categories", "providers_categories.category_id", "categories.id")
				.where("providers_categories.provider_id", provider.id)
				.select("categories.id", "categories.name");

			return res.status(200).json({
				role,
				user,
				provider: {
					id: provider.id,
					bio: provider.bio,
					status: provider.status,
					cnpj: provider.cnpj,
					categories,
				},
			});
		}

		return res.status(403).json({ error: "Perfil não autorizado" });
	} catch (error) {
		console.error("Erro ao buscar perfil:", error);
		return res.status(500).json({ error: "Erro interno do servidor" });
	}
}

export async function getMyRatings(req, res) {
	const providerId = req.user?.provider_id;

	try {
		const reviews = await providerModel.getRatingsByProviderId(providerId);
		res.json(reviews);
	} catch (error) {
		res.status(500).json({error: "Erro ao buscar avaliações"});
	}
}

export async function getRatingsSummary(req, res) {
	const providerId = req.user?.provider_id;

	try {
		const summary = await providerModel.getRatingsSummary(providerId);
		res.json(summary);
	} catch (error) {
		res.status(500).json({error: "Erro ao buscar resumo das avaliações"});
	}
}
