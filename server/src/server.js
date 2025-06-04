import express from "express";
import dotenv from "dotenv";
import providerRoutes from "./routes/provider/provider.routes.js";
import catalogoRoutes from "./routes/public/catalogo.routes.js";
import adminRoutes from "./routes/admin/admin.routes.js";
import publicRoutes from "./routes/public/auth.routes.js";
dotenv.config();

const app = express();
app.use(express.json());


app.use("/", providerRoutes); 
app.use("/", adminRoutes);
app.use("/", catalogoRoutes);
app.use("/", publicRoutes);



const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
	console.log(`Servidor rodando em http://localhost:${PORT}`);
});
