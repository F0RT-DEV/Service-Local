import db from "../db.js";
import * as providerModel from "../models/provider.model.js";

export async function updateProvider(req, res) {
  const { id } = req.params; // user_id
  const { bio, status, categories, cnpj, areas_of_expertise, availability } = req.body;

  try {
    // Atualiza dados do provider
    await providerModel.updateByUserId(id, { 
      bio, 
      status, 
      cnpj,
      areas_of_expertise,
      availability 
    });

    // Recupera provider.id com base no user_id
    const provider = await providerModel.getByUserId(id);
    if (!provider) {
      return res.status(404).json({ error: "Prestador não encontrado" });
    }

    // Remove categorias antigas (se necessário)
    await db("providers_categories").where({ provider_id: provider.id }).del();

    // Insere novas categorias
    if (Array.isArray(categories) && categories.length > 0) {
      await providerModel.addCategories(provider.id, categories);
    }

    res.status(200).json({ message: "Prestador atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar prestador:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function getPrestadores(req, res) {
  try {
    const prestadores = await providerModel.getAllWithCategories();
    res.status(200).json(prestadores);
  } catch (error) {
    console.error("Erro ao buscar prestadores:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function getPrestadorById(req, res) {
  const { id } = req.params;
  try {
    const prestador = await providerModel.getByIdWithCategories(id);
    if (!prestador) {
      return res.status(404).json({ message: "Prestador não encontrado" });
    }
    res.status(200).json(prestador);
  } catch (error) {
    console.error("Erro ao buscar prestador por ID:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}