import * as providerModel from '../models/provider.model.js';

export async function getPrestador(req, res) {
	try {
		const prestadores = await providerModel.getAll();
		res.status(200).json(prestadores);
	} catch (error) {
		res.status(500).json({error});
	}
}
