import express from "express";
import { createCategory, getAllCategories } from "../../domains/category/category.controller.js";
import { getPrestadores, getPrestadorById } from "../../domains/provider/provider.controller.js";

const router = express.Router();

router.post("/categories", createCategory);
router.get("/categories", getAllCategories);
router.get("/providers", getPrestadores);
router.get("/providers/:id", getPrestadorById);

export default router;
