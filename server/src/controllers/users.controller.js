import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import * as userModel from "../models/users.model.js";
import * as providerModel from "../models/provider.model.js";
import { createUserSchema } from "../schemas/user.schema.js";

export async function createUser(req, res) {
  try {
    // Validate with Zod
    const result = createUserSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        error: "Dados inválidos", 
        details: result.error.format() 
      });
    }

    const { 
      name, 
      email, 
      password, 
      phone, 
      role, 
      cep, 
      logradouro, 
      complemento, 
      bairro, 
      localidade, 
      uf, 
      numero 
    } = result.data;

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await userModel.create({
      id: userId,
      name,
      email,
      password_hash: passwordHash,
      phone,
      role: role || "client",
      cep,
      logradouro,
      complemento,
      bairro,
      localidade,
      uf,
      numero
    });

    if (role === "provider") {
      await providerModel.create({ user_id: userId });
    }

    res.status(201).json({ 
      message: "Usuário criado com sucesso!", 
      user_id: userId, 
      role 
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Email já cadastrado" });
    }
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function getUsers(req, res) {
  try {
    const users = await userModel.getAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function getUserById(req, res) {
  try {
    const user = await userModel.getById(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}