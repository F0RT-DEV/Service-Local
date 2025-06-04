import {Router} from "express";
import {createUser, loginUser} from "../../domains/user/users.controller.js";
import {getAuthenticatedProfile} from "../../domains/provider/provider.controller.js";
import {authenticateToken} from "../../middlewares/authMiddleware.js";
const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/me",authenticateToken, getAuthenticatedProfile)

export default router;