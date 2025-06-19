import express from "express";

import { getAllReviewsForAdmim } from "../../modules/review/review.controller.js";
const router = express.Router();

router.get("/admin/ratings", getAllReviewsForAdmim);

export default router;