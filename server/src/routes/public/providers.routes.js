import express from "express";
import {
	getPrestadores,
	getPrestadorById,
} from "../../modules/provider/provider.controller.js";
import {getAllServicesByProviderIdHandler} from "../../modules/service/service.controller.js";

const router = express.Router();

router.get("/providers", getPrestadores);
router.get("/providers/:id", getPrestadorById);
router.get(
	"/providers/:providerId/services",
	getAllServicesByProviderIdHandler
);

export default router;
