import { Router } from "express";
import * as providerController from "../controllers/provider.controller.js";
const router = Router();

// Rotas de Prestador
router.get("/prestador", providerController.getPrestador);

export default router;