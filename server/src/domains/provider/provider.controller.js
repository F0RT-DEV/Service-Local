import db from "../../db.js";
import * as providerModel from "./provider.model.js";

export async function updateProvider(req, res) {
  const { id } = req.params; // user_id
  const { bio, status, categories, cnpj, areas_of_expertise, availability } = req.body;

  try {
    // Validação básica
    if (!bio && !cnpj && !categories && !availability) {
      return res.status(400).json({ error: "Nenhum dado válido para atualização" });
    }

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
    if (Array.isArray(categories)) {
      await db("providers_categories").where({ provider_id: provider.id }).del();

      // Insere novas categorias
      if (categories.length > 0) {
        await providerModel.addCategories(provider.id, categories);
      }
    }

    res.status(200).json({ 
      message: "Prestador atualizado com sucesso!",
      provider_id: provider.id
    });
  } catch (error) {
    console.error("Erro ao atualizar prestador:", error);
    
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    
    res.status(500).json({ 
      error: "Erro interno do servidor",
      details: error.message
    });
  }
}

export async function getPrestadores(req, res) {
  try {
    const prestadores = await providerModel.getAllWithCategories();
    res.status(200).json(prestadores);
  } catch (error) {
    console.error("Erro ao buscar prestadores:", error);
    res.status(500).json({ 
      error: "Erro ao buscar prestadores",
      details: error.message
    });
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
    res.status(500).json({ 
      error: "Erro ao buscar prestador",
      details: error.message
    });
  }
}
export async function getAuthenticatedProfile(req, res) {
  const { id, role } = req.user;

  try {
    if (role === "client" ) {
      const user = await db("users").where({ id }).first();
      if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

      return res.status(200).json({ role, user });
    }

    if (role === "provider") {
      const user = await db("users").where({ id }).first();
      if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

      const provider = await db("providers").where({ user_id: id }).first();
      if (!provider) return res.status(404).json({ error: "Prestador não encontrado" });

      return res.status(200).json({ role, user, provider });
    }

    return res.status(403).json({ error: "Perfil não autorizado" });
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}