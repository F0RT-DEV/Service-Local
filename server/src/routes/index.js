import {Router} from "express";
import providerServices from "./provider/services.routes.js";

import authRoutes from "./auth/auth.routes.js";
import adminProvider from "./admin/providers.routes.js";
import clientOrders from "./client/orders.routes.js";
import providerProfile from "./provider/profile.routes.js";
import ratingsProfile from "./provider/ratings.routes.js";
import providerOrders from "./provider/orders.routes.js";
import publicCategories from "./public/categories.routes.js";
import publicProviders from "./public/providers.routes.js";
import publicServices from "./public/services.routes.js";
import reviewRoutes from "./public/reviews.routes.js";
import dashboardAdmin from "./admin/dashboard.routes.js";
import ratingsAdmin from "./admin/ratings.routes.js";
import ordersAdmin from "./admin/orders.routes.js";

import express from "express";
const app = express();

// Middleware para interpretar JSON no corpo da requisição
app.use(express.json());
const router = Router();

// Agrupamento
router.use(authRoutes);
router.use(adminProvider);
router.use(ratingsProfile);
router.use(clientOrders);
router.use(providerProfile);
router.use(providerServices);
router.use(providerOrders);
router.use(publicCategories);
router.use(publicProviders);
router.use(publicServices);
router.use(reviewRoutes);
router.use(dashboardAdmin);
router.use(ordersAdmin);
router.use(ratingsAdmin);

export default router;
