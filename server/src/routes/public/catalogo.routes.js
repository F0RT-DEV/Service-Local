import express from "express";
import {
	createCategory,
	getAllCategories,
} from "../../domains/category/category.controller.js";
import {
	getPrestadores,
	getPrestadorById,
} from "../../domains/provider/provider.controller.js";
import {getServiceByIdHandler,getAllServicesHandler,getAllServicesByProviderIdHandler,getAllServicesByCategoryHandler} from "../../domains/service/service.controller.js";

const router = express.Router();

router.post("/categories", createCategory);
router.get("/categories", getAllCategories);
router.get("/providers", getPrestadores);
router.get("/providers/:id", getPrestadorById);
router.get("/services/:id", getServiceByIdHandler);
router.get("/services", getAllServicesHandler)
router.get("/services/category/:categoryId", getAllServicesByCategoryHandler);
router.get("/providers/:providerId/services", getAllServicesByProviderIdHandler);

export default router;
