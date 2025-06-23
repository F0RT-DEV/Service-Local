import bcrypt from "bcryptjs"; // Confirme se está correto
import {v4 as uuidv4} from "uuid";
import * as userModel from "./users.model.js";
import * as providerModel from "../provider/provider.model.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

import {UserSchema} from "./users.schema.js"; // Corrigido o caminho!

export async function createUser(req, res) {
	try {
		const result = UserSchema.safeParse(req.body);
		if (!result.success) {
			return res.status(400).json({
				error: "Dados inválidos",
				details: result.error.format(),
			});
		}

		const {
			name,
			email,
			password,
			phone,
			role = "client",
			cep,
			cpf,
			logradouro,
			complemento,
			bairro,
			localidade,
			uf,
			numero,
		} = result.data;

		// Verifica se o e-mail já está em uso
		const existingUser = await userModel.getByEmail(email);
		if (existingUser) {
			return res.status(409).json({error: "Email já cadastrado"});
		}

		// Criptografa a senha
		const passwordHash = await bcrypt.hash(password, 10);
		const userId = uuidv4();

		// Cria o usuário no banco
		await userModel.create({
			id: userId,
			name,
			email,
			password_hash: passwordHash,
			phone,
			role,
			cep,
			cpf,
			logradouro,
			complemento,
			bairro,
			localidade,
			uf,
			numero,
			created_at: new Date(),
			updated_at: new Date(),
		});

		// Se for prestador de serviço, cria a relação com provider
		if (role === "provider") {
			await providerModel.create({
				user_id: userId,
				status: "pending",
			});
		}

		res.status(201).json({
			message: "Usuário criado com sucesso!",
			user_id: userId,
			role,
		});
	} catch (error) {
		console.error("Erro ao criar usuário:", error);
		res.status(500).json({
			error: "Erro interno do servidor",
			details: error.message,
		});
	}
}

export async function getProviders(req, res) {
	try {
		const users = await userModel.getAllProviders();
		res.status(200).json(users);
	} catch (error) {
		console.error("Erro ao buscar usuários:", error);
		res.status(500).json({
			error: "Erro ao buscar usuários",
			details: error.message,
		});
	}
}

export async function getUserById(req, res) {
	const {id} = req.params;
	try {
		const user = await userModel.getById(id);
		if (!user) {
			return res.status(404).json({error: "Usuário não encontrado"});
		}
		res.status(200).json(user);
	} catch (error) {
		console.error("Erro ao buscar usuário:", error);
		res.status(500).json({
			error: "Erro ao buscar usuário",
			details: error.message,
		});
	}
}
export async function loginUser(req, res) {
	try {
		const {email, password} = req.body;

		const result = UserSchema.pick({email: true, password: true}).safeParse(
			req.body
		);
		if (!result.success) {
			return res
				.status(400)
				.json({error: "Dados inválidos", details: result.error.format()});
		}

		const user = await userModel.getByEmail(email);
		if (!user) {
			return res.status(401).json({error: "Credenciais inválidas"});
		}

		const validPassword = await bcrypt.compare(password, user.password_hash);
		if (!validPassword) {
			return res.status(401).json({error: "Credenciais inválidas"});
		}

		let provider_id = null;
		if (user.role === "provider") {
			// Buscar o provider_id relacionado ao user.id
			const provider = await providerModel.getByUserId(user.id); // ou como você consulta o provider
			if (provider) {
				provider_id = provider.id;
			}
		}

		// Gera o token com id, role e provider_id (se houver)
		const tokenPayload = {id: user.id, role: user.role};
		if (provider_id) {
			tokenPayload.provider_id = provider_id;
		}

		const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
			expiresIn: "8h",
		});

		res.json({
			message: "Login realizado com sucesso!",
			token,
			user,
		});
	} catch (error) {
		console.error("Erro ao realizar login:", error);
		res
			.status(500)
			.json({error: "Erro interno do servidor", details: error.message});
	}
}

export async function resetPassword(req, res) {
	try {
		const {email, password} = req.body;

		const user = await userModel.getByEmail(email);
		if (!user) {
			return res.status(404).json({error: "Usuário nao encontrado"});
		}

		// Hash da nova senha
		const password_hash = await bcrypt.hash(password, 10);

		// Atualiza a senha do usuário usando o id e a senha com hash
		await userModel.updatePassword(user.id, password_hash);

		res.status(200).json({message: "Senha atualizada com sucesso!"});
	} catch (error) {
		console.error("Erro ao atualizar senha:", error);
		res.status(500).json({
			error: "Erro ao atualizar senha",
			details: error.message,
		});
	}
}
export async function updateMyProfile(req, res) {
  const userId = req.user.id;
  const updates = req.body;

  try {
    await userModel.update(userId, updates);
    const updatedUser = await userModel.getById(userId);
    if (!updatedUser) {
      return res.status(404).json({ error: "Usuário não encontrado após atualização" });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error("Erro ao atualizar perfil do usuário:", userId, updates, error);
    res.status(500).json({ error: "Erro ao atualizar perfil do usuário" });
  }
}

export async function deleteMyAccount(req, res) {
  const userId = req.user.id;

  try {
    await userModel.remove(userId); // Corrigido!
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar conta do usuário" });
  }
}
export async function updateMyAvatar(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado." });
    }
    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    await userModel.update(req.user.id, { avatar: avatarPath });
    res.json({ avatar: avatarPath });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar avatar." });
  }
}