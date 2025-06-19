import {Router} from "express";
import {getAuthenticatedProfile} from "../../modules/provider/provider.controller.js";
import {authenticateToken} from "../../middlewares/authMiddleware.js";
import {
	resetPassword,
	createUser,
	loginUser,
	updateMyProfile,deleteMyAccount} from "../../modules/user/users.controller.js";
const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/me", authenticateToken, getAuthenticatedProfile);
router.put("/me", authenticateToken, updateMyProfile);
router.delete("/me", authenticateToken, deleteMyAccount);

router.put("/resetPassword", resetPassword);



export default router;
