import { authenticateToken } from "../../middlewares/authMiddleware";
import { verifyProviderRole } from "../../middlewares/role.middleware";
import { getAllOrders, getOrderById } from "../../modules/order/order.controller";
import router from "./services.routes";

router.get(
  "proverder/orders",
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


export default router;