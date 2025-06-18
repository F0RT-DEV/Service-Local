  import { authenticateToken } from "../../middlewares/authMiddleware.js";
import { verifyProviderRole } from "../../middlewares/role.middleware.js";
import {
    getAllOrders,
    getOrderById,
    acceptOrder,
    rejectOrder,
} from "../../modules/order/order.controller.js";
import router from "./services.routes.js";
//const router = express.Router();

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