import {Router} from "express";
import {readUsers} from "../../modules/admin/admin.controller.js";

const router = Router();

router.get("/admin/users", readUsers);

export default router;
