import ProviderModel from "./admin.model.js";
import db from "../../db.js";

export async function approveProvider(req, res) {
	try {
		const {id} = req.params;

		const provider = await ProviderModel.findById(id);
		if (!provider)
			return res.status(404).json({message: "Prestador não encontrado"});

		if (provider.status === "approved")
			return res.status(400).json({message: "Prestador já aprovado"});
		await ProviderModel.updateStatus(id, "approved");

		return res.status(200).json({message: "Prestador aprovado com sucesso"});
	} catch (error) {
		console.error(error);
		return res.status(500).json({message: "Erro interno do servidor"});
	}
}
export async function rejectProvider(req, res) {
	try {
		const {id} = req.params;

		const provider = await ProviderModel.findById(id);
		if (!provider)
			return res.status(404).json({message: "Prestador não encontrado"});

		if (provider.status === "rejected")
			return res.status(400).json({message: "Prestador já rejeitado"});
		await ProviderModel.updateStatus(id, "rejected");

		return res.status(200).json({message: "Prestador rejeitado com sucesso"});
	} catch (error) {
		console.error(error);
		return res.status(500).json({message: "Erro interno do servidor"});
	}
}
export async function getPendingProviders(req, res) {
    try {
        //console.log("Iniciando busca de providers pendentes"); // <-- Aqui
        const pendingProviders = await ProviderModel.findPendingWithDetails();
        console.log("Providers encontrados:", pendingProviders); // <-- Aqui
        return res.status(200).json(pendingProviders);
    } catch (error) {
        console.error("Erro em getPendingProviders:", error); // <-- Aqui
        return res.status(500).json({message: "Erro interno do servidor"});
    }
}
export async function getApprovedProviders(req, res) {
	try {
		const approvedProviders = await ProviderModel.findApproved();
		return res.status(200).json(approvedProviders);
	} catch (error) {
		console.error(error);
		return res.status(500).json({message: "Erro interno do servidor"});
	}
}
export async function readUsers(req, res) {
	try {
		const users = await ProviderModel.getAllUsers();
		return res.status(200).json(users);
	} catch (error) {
		console.error(error);
		return res.status(500).json({message: "Erro interno do servidor"});
	}
}

export async function getDashboardStats(req, res) {
	try {
		const [users, providers, orders, reviews] = await Promise.all([
			db("users").count("id as total_users").first(),
			db("providers").count("id as total_providers").first(),
			db("orders").count("id as total_orders").first(),
			db("orders").whereNotNull("rating").count("id as total_reviews").first(),
		]);

		// Convertendo os valores para números (MySQL retorna como string)
		res.json({
			total_users: Number(users.total_users),
			total_providers: Number(providers.total_providers),
			total_orders: Number(orders.total_orders),
			total_reviews: Number(reviews.total_reviews),
		});
	} catch (error) {
		console.error("Erro ao buscar estatísticas do dashboard:", error);
		res.status(500).json({error: "Erro ao buscar estatísticas do dashboard"});
	}
}
