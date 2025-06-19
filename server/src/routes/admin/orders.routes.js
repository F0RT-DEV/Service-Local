import { getAllOrders, updateOrderStatus } from "../../modules/order/order.controller.js";
import express from "express";

const router = express.Router();


router.get("/admin/orders", getAllOrders);
router.patch("/admin/orders/:id/status", updateOrderStatus);

export default router;