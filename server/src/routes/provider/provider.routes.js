import {Router} from "express";
import {
	updateProvider,
	getAuthenticatedProfile
	
} from "../../domains/provider/provider.controller.js";
import {verifyProviderRole} from "../../middlewares/role.middleware.js";
import {authenticateToken} from "../../middlewares/authMiddleware.js";

const router = Router();

router.put("/register/provider/:id",authenticateToken, verifyProviderRole, updateProvider);



export default router;
