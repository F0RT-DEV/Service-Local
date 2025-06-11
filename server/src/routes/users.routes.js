import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  loginUser, // ← adiciona a função de login
} from "../controllers/users.controller.js";

const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser); // ← adiciona a rota de login
router.get("/users", getUsers);
router.get("/users/:id", getUserById);

export default router;
