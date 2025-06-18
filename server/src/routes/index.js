import {Router} from "express";

import authRoutes from "./auth/auth.routes.js";
import adminProvider from "./admin/providers.routes.js";
import adminUsers from "./admin/users.routes.js";
import clientOrders from "./client/orders.routes.js";
import providerProfile from "./provider/profile.routes.js";
import providerServices from "./provider/services.routes.js";
import providerOrders from "./provider/orders.routes.js";
import publicCategories from "./public/categories.routes.js";
import publicProviders from "./public/providers.routes.js";
import publicServices from "./public/services.routes.js";


const router = Router();

// Agrupamento
router.use(authRoutes);
router.use(adminProvider);
router.use(adminUsers);
router.use(clientOrders);
router.use(providerProfile);
router.use(providerServices);
router.use(providerOrders);
router.use(publicCategories);
router.use(publicProviders);
router.use(publicServices);

export default router;
