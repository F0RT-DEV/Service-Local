import express from "express";
import {
	createCategory,
	getAllCategories,
} from "../../domains/category/category.controller.js";
import {
	getPrestadores,
	getPrestadorById,
} from "../../domains/provider/provider.controller.js";
import {getServiceByIdHandler,getAllServicesHandler} from "../../domains/service/service.controller.js";

const router = express.Router();

router.post("/categories", createCategory);
router.get("/categories", getAllCategories);
router.get("/providers", getPrestadores);
router.get("/providers/:id", getPrestadorById);
router.get("/services/:id", getServiceByIdHandler);
router.get("/services", getAllServicesHandler)

export default router;
