import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import adminRoutes from "./modules/admin/admin.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import categoryRoutes from "./modules/category/category.routes.js";
import providerRoutes from "./modules/provider/provider.routes.js";
import publicRouter from "./modules/routes.js";
import orderRoutes from "./modules/order/order.routes.js";
// import paymentRoutes from "./modules/payment/payment.routes.js";
// import reviewRoutes from "./modules/review/review.routes.js";
import serviceRoutes from "./modules/service/service.routes.js";
// import userRoutes from "./modules/user/users.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", adminRoutes);
app.use("/", authRoutes);
app.use("/", categoryRoutes);
app.use("/", providerRoutes);
app.use("/", publicRouter);
app.use("/", serviceRoutes);
app.use("/", orderRoutes);

// app.use("/", orderRoutes);
// app.use("/", paymentRoutes);
// app.use("/", reviewRoutes);
// app.use("/", userRoutes);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
	console.log(`Servidor rodando em http://localhost:${PORT}`);
});
