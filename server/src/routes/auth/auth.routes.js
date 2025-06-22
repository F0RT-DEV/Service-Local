import {Router} from "express";
import {getAuthenticatedProfile} from "../../modules/provider/provider.controller.js";
import {authenticateToken} from "../../middlewares/authMiddleware.js";
import {
	resetPassword,
	createUser,
	loginUser,
	updateMyProfile,
	deleteMyAccount,
	updateMyAvatar, // <-- Adicione aqui
} from "../../modules/user/users.controller.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// Configuração do Multer para upload de avatar
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const dir = "./uploads/avatars";
		if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive: true});
		cb(null, dir);
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname);
		cb(null, req.user.id + "_avatar" + ext);
	},
});
const upload = multer({storage});

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/me", authenticateToken, getAuthenticatedProfile);
router.put("/me", authenticateToken, updateMyProfile);
router.delete("/me", authenticateToken, deleteMyAccount);
router.put("/resetPassword", resetPassword);

// ROTA DE UPLOAD DE AVATAR
router.post(
	"/me/avatar",
	authenticateToken,
	upload.single("avatar"),
	updateMyAvatar
);

export default router;
