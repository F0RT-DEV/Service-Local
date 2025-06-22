import {
	createServiceHandler,
	getMyServicesHandler,
	getTotalServicesForProvider
} from "../../modules/service/service.controller.js";
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
router.get(
	"/services/me",
	authenticateToken,
	verifyProviderRole,
	getMyServicesHandler
);
router.get(
  "/services/total",
  authenticateToken,
  verifyProviderRole,
  getTotalServicesForProvider
);
export default router;
