import {Router} from "express";
import {updateProvider} from "../../modules/provider/provider.controller.js";
import {verifyProviderRole} from "../../middlewares/role.middleware.js";
import {authenticateToken} from "../../middlewares/authMiddleware.js";

const router = Router();

router.put("/provider", authenticateToken, verifyProviderRole, updateProvider);

export default router;
