  import { authenticateToken } from "../../middlewares/authMiddleware";
import { verifyProviderRole } from "../../middlewares/role.middleware";
import {
    getAllOrders,
    getOrderById,
    acceptOrder,
    rejectOrder,
} from "../../modules/order/order.controller";
import router from "./services.routes";

router.get(
    "/provider/orders",
    authenticateToken,
    verifyProviderRole,
    getAllOrders
);

router.get(
    "/provider/orders/:id",
    authenticateToken,
    verifyProviderRole,
    getOrderById
);

router.patch(
    "/provider/orders/:id/accept",
    authenticateToken,
    verifyProviderRole,
    acceptOrder
);

router.patch(
    "/provider/orders/:id/reject",
    authenticateToken,
    verifyProviderRole,
    rejectOrder
);

export default router;