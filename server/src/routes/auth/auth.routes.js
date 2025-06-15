import {Router} from "express";
import {getAuthenticatedProfile} from "../../modules/provider/provider.controller.js";
import {authenticateToken} from "../../middlewares/authMiddleware.js";
import {resetPassword,createUser, loginUser} from "../../modules/user/users.controller.js";
const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/me",authenticateToken, getAuthenticatedProfile)
router.put("/resetPassword", resetPassword);

export default router;