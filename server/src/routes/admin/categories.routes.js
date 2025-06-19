import express from "express";
import {
	createCategory,
	getAllCategories,
	updateCategory,
	deleteCategory
} from "../../modules/category/category.controller.js";

const router = express.Router();

router.post("/categories", createCategory);
router.get("/categories", getAllCategories);



router.get("/admin/orders", getAllCategories);


export default router;
