import bcrypt from "bcrypt";
import * as User from "../models/userModel.js";

export async function listUsers(req, res) {
  const users = await User.getAllUsers();
  res.json(users);
}

export async function getUser(req, res) {
  const user = await User.getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
  res.json(user);
}

export async function createUser(req, res) {
  const { nome, email, senha, tipo } = req.body;
  const hash = await bcrypt.hash(senha, 10);
  await User.createUser({ nome, email, senha: hash, tipo });
  res.status(201).json({ message: "Usuário criado com sucesso" });
}

export async function updateUser(req, res) {
  const { nome, email, senha, tipo } = req.body;
  const hash = senha ? await bcrypt.hash(senha, 10) : undefined;

  const dadosAtualizados = {
    ...(nome && { nome }),
    ...(email && { email }),
    ...(tipo && { tipo }),
    ...(hash && { senha: hash })
  };

  await User.updateUser(req.params.id, dadosAtualizados);
  res.json({ message: "Usuário atualizado com sucesso" });
}

export async function deleteUser(req, res) {
  await User.deleteUser(req.params.id);
  res.json({ message: "Usuário deletado com sucesso" });
}
