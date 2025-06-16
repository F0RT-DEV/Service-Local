import express from "express";
import * as orderController from "../../modules/order/order.controller.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";
import { verifyUserRole } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.post("/orders", authenticateToken, verifyUserRole, orderController.createOrder);
router.get("/orders", orderController.getAllOrders);
router.get("/orders/:id", orderController.getOrderById);
router.put("/orders/:id", orderController.updateOrder);
router.delete("/orders/:id", orderController.deleteOrder);

export default router;
