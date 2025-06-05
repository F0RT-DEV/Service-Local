import {Router} from "express";
import {
	approveProvider,
	rejectProvider,
	getPendingProviders,
	getApprovedProviders,
	readUsers,
} from "../../domains/admin/admin.controller.js";

import {verifyAdminRole} from "../../middlewares/role.middleware.js";
import {authenticateToken} from "../../middlewares/authMiddleware.js";
const router = Router();

router.put(
	"/admin/:id/approve",
	authenticateToken,
	verifyAdminRole,
	approveProvider
);
router.put(
	"/admin/:id/reject",
	authenticateToken,
	verifyAdminRole,
	rejectProvider
);
router.get(
	"/admin/providers/pending",
	authenticateToken,
	verifyAdminRole,
	getPendingProviders
);
router.get(
	"/admin/providers/approved",
	authenticateToken,
	verifyAdminRole,
	getApprovedProviders
);
router.get("/admin/users", readUsers);

export default router;
