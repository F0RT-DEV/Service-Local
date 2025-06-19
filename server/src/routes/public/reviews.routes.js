import { Router } from "express";
import {
    getReviewsByProvider,
    getRatingsSummary,
    
} from "../../modules/review/review.controller.js"


const router = Router();

// Rotas públicas
router.get("/providers/:id/reviews", getReviewsByProvider);
router.get("/providers/:id/ratings/summary", getRatingsSummary);



export default router;
