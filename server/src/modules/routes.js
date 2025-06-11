import express from "express";
import {getAllCategories} from "../modules/category/category.controller.js";
import {
	getPrestadores,
	getPrestadorById,
} from "../modules/provider/provider.controller.js";
import {
	getServiceByIdHandler,
	getAllServicesHandler,
	getAllServicesByProviderIdHandler,
	getAllServicesByCategoryHandler,
} from "../modules/service/service.controller.js";
import {
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "./order/order.controller.js";


const router = express.Router();

router.get("/categories", getAllCategories);
router.get("/providers", getPrestadores);
router.get("/providers/:id", getPrestadorById);
router.get("/services/:id", getServiceByIdHandler);
router.get("/services", getAllServicesHandler);
router.get("/services/category/:categoryId", getAllServicesByCategoryHandler);
router.get(
	"/providers/:providerId/services",
	getAllServicesByProviderIdHandler
);

export default router;
