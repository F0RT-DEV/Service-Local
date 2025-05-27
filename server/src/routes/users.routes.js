import {Router} from "express";
import * as UsersController from "../controllers/users.controller.js";

const router = Router();

// Rotas do Angelo
router.post("/auth/register", UsersController.createUser);
router.get("/users", UsersController.getUsers);
router.get("/users/:id", UsersController.getUserById);



export default router;
