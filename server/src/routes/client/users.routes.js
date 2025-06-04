import {Router} from "express";
import {
	createUser,
	getUsers,
	getUserById,
	loginUser
} from "../../domains/user/users.controller.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/users", authenticateToken, getUsers);
router.get("/users/:id", authenticateToken, getUserById);

export default router;
