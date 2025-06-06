import {
	createServiceHandler,
	getServiceByIdHandler,
} from "../../domains/service/service.controller.js";
import {verifyProviderRole} from "../../middlewares/role.middleware.js";
import {authenticateToken} from "../../middlewares/authMiddleware.js";

import {Router} from "express";

const router = Router();

router.post(
	"/services",
	authenticateToken,
	verifyProviderRole,
	createServiceHandler
);


export default router;
