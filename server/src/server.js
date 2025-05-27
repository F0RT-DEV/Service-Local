import express from "express";
import usersRoutes from "./routes/users.routes.js";
import dotenv from "dotenv";
import providerRoutes from "./routes/provider.routes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/", usersRoutes);
app.use("/", providerRoutes); // Assuming you want to use the same routes for providers

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
	console.log(`Servidor rodando em http://localhost:${PORT}`);
});
