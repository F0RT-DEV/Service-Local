import { Router } from "express";
import { createUser, getUsers, getUserById } from "../controllers/users.controller.js";

const router = Router();

router.post("/register", createUser);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);

export default router;
