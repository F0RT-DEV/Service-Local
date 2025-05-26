import { Router } from "express";
import * as providerController from "../controllers/provider.controller.js";
const router = Router();
router.get("/", providerController.getPrestador);