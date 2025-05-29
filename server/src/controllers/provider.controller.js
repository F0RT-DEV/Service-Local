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


export async function putProvider(req, res) {
  const { id } = req.params;
  const {
    bio,
    areas_of_expertise,
    availability,
    status,
    cnpj,
    categoryIds // ← esse vem do frontend
  } = req.body;

  try {
    // 1. Atualiza os dados da tabela "providers"
    await providerModel.putProvider(id, {
      bio,
      areas_of_expertise,
      availability,
      status,
      cnpj
    });

    // 2. Se categoryIds for um array, atualiza as categorias
    if (Array.isArray(categoryIds)) {
      // Apaga as categorias anteriores
      await db('providers_categories').where({ provider_id: id }).del();

      // Adiciona as novas categorias
      const insertData = categoryIds.map((categoryId) => ({
        provider_id: id,
        category_id: categoryId
      }));

      await db('providers_categories').insert(insertData);
    }

    res.status(200).json({ message: 'Prestador atualizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar prestador:', error);
    res.status(500).json({ error: 'Erro ao atualizar prestador' });
  }
}
