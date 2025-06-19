import express from "express";
import {authenticateToken} from "../../middlewares/authMiddleware.js";
import {verifyProviderRole} from "../../middlewares/role.middleware.js";
import {
	getMyRatings,
	getRatingsSummary,
} from "../../modules/provider/provider.controller.js";

const router = express.Router();

router.get(
	"/providers/ratings",
	authenticateToken,
	verifyProviderRole,
	getMyRatings
);
router.get(
	"/providers/ratings/summary",
	authenticateToken,
	verifyProviderRole,
	getRatingsSummary
);

export default router;
