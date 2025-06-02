import { Router } from "express";
import {
	updateProvider,
	getPrestadores,
	getPrestadorById
} from "../controllers/provider.controller.js";

const router = Router();

router.put("/register/provider/:id", updateProvider);
router.get("/providers", getPrestadores);
router.get("/providers/:id", getPrestadorById);

export default router;
