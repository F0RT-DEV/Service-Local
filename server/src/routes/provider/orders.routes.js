import {authenticateToken} from "../../middlewares/authMiddleware.js";
import {verifyProviderRole} from "../../middlewares/role.middleware.js";
import {
	acceptOrder,
	rejectOrder,
	getProviderOrders,
	getProviderOrderById,
	startOrderProgress,
	completeOrder,
	getPendingOrdersCountForProvider,
	getPendingOrdersForProvider,
	getTotalOrdersForProvider,
} from "../../modules/order/order.controller.js";
import router from "./services.routes.js";
//const router = express.Router();

router.get(
	"/providers/orders",
	authenticateToken,
	verifyProviderRole,
	getProviderOrders
);
router.get(
  "/orders/total",
  authenticateToken,
  verifyProviderRole,
  getTotalOrdersForProvider
);
router.get(
	"/orders/pending/count",
	authenticateToken,
	verifyProviderRole,
	getPendingOrdersCountForProvider
);
router.get(
	"/orders/pending",
	authenticateToken,
	verifyProviderRole,
	getPendingOrdersForProvider
);
router.get(
	"/providers/orders/:id",
	authenticateToken,
	verifyProviderRole,
	getProviderOrderById
);
router.patch(
	"/providers/orders/:id/accept",
	authenticateToken,
	verifyProviderRole,
	acceptOrder
);
router.patch(
	"/providers/orders/:id/reject",
	authenticateToken,
	verifyProviderRole,
	rejectOrder
);
router.patch(
	"/providers/orders/:id/progress",
	authenticateToken,
	verifyProviderRole,
	startOrderProgress
);
router.patch(
	"/providers/orders/:id/complete",
	authenticateToken,
	verifyProviderRole,
	completeOrder
);

export default router;
