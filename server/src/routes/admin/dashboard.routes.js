import express from "express";
import { getDashboardStats,readUsers } from "../../modules/admin/admin.controller.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";
import { verifyAdminRole } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/admin/dashboard", authenticateToken, verifyAdminRole, getDashboardStats);
router.get("/admin/users", readUsers);

export default router;