import express from "express";
import { createCategory, getAllCategories } from "../../domains/category/category.controller.js";

const router = express.Router();

router.post("/categories", createCategory);
router.get("/categories", getAllCategories);

export default router;
