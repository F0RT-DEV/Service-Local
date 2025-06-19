import * as reviewModel from "./review.model.js";

// Ver avaliações públicas de um prestador
export async function getReviewsByProvider(req, res) {
	try {
		const { id } = req.params;
		const reviews = await reviewModel.getReviewsByProviderId(id);
		res.status(200).json(reviews);
	} catch (err) {
		res.status(500).json({
			error: "Erro ao buscar avaliações do prestador",
			details: err.message,
		});
	}
}

// Obter resumo das avaliações
export async function getRatingsSummary(req, res) {
	try {
		const { id } = req.params;
		const summary = await reviewModel.getRatingsSummary(id);
		res.status(200).json(summary[0]); // avg/count vem como array
	} catch (err) {
		res.status(500).json({
			error: "Erro ao gerar resumo das avaliações",
			details: err.message,
		});
	}
}

	// Avaliações visíveis ao admin
	export async function getAllReviewsForAdmim(req, res) {
		try {
			const reviews = await reviewModel.getAllReviewsForAdmin();
			res.status(200).json(reviews);
		} catch (err) {
			res.status(500).json({
				error: "Erro ao buscar todas as avaliações",
				details: err.message,
			});
		}
	}
