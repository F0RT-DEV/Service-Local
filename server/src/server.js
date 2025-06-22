import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/index.js"; // ou só "./routes"
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use(routes);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
	console.log(`Servidor rodando em http://localhost:${PORT}`);
});
