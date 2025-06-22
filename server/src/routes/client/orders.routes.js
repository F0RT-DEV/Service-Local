import express from "express";
import * as orderController from "../../modules/order/order.controller.js";
import {authenticateToken} from "../../middlewares/authMiddleware.js";
import {verifyUserRole} from "../../middlewares/role.middleware.js";

const router = express.Router();

// CLIENT
router.post(
	"/clients/orders",
	authenticateToken,
	verifyUserRole,
	orderController.createOrder
);
router.get(
	"/clients/orders",
	authenticateToken,
	verifyUserRole,
	orderController.getClientOrders
);
router.get(
	"/clients/orders/:id",
	authenticateToken,
	verifyUserRole,
	orderController.getClientOrderById
);
router.patch(
	"/clients/orders/:id/cancel",
	authenticateToken,
	verifyUserRole,
	orderController.cancelClientOrder
);
router.patch(
	"/clients/orders/:id/rate",
	authenticateToken,
	verifyUserRole,
	orderController.rateOrder
);

router.get(
	"/orders",

	orderController.getAllOrders
);
router.get(
	"/clients/orders/finished/count",
	authenticateToken,
	orderController.getClientFinishedOrdersCount
);
router.get(
	"/clients/providers/unique/count",
	authenticateToken,
	orderController.getClientUniqueProvidersCount
);

export default router;
