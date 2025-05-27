import * as providerModel from '../models/provider.model.js';

export async function getPrestador(req, res) {
	try {
		const prestadores = await providerModel.getAll();
		res.status(200).json(prestadores);
	} catch (error) {
		res.status(500).json({error});
	}
}
export async function getPrestadorById(req, res) {
	try {
		const { id } = req.params;
		const prestador = await providerModel.getById(id);
		if (!prestador) {
			return res.status(404).json({ message: 'Prestador não encontrado' });
		}
		res.status(200).json(prestador);
	} catch (error) {
		res.status(500).json({ error });
	}
}