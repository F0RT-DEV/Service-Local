import express from "express";

import {
	getServiceByIdHandler,
	getAllServicesHandler,
	getAllServicesByCategoryHandler,
} from "../../modules/service/service.controller.js";

const router = express.Router();

router.get("/services/:id", getServiceByIdHandler);
router.get("/services", getAllServicesHandler);
router.get("/services/category/:categoryName", getAllServicesByCategoryHandler);

export default router;
