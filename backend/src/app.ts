import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import gameRoutes from "./routes/game.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/error-handler.js";

dotenv.config();

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : true;

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res
    .status(200)
    .json({ status: "ok", message: "Catalogo de jogos API funcionando" });
});

app.use("/api/auth", authRoutes);
app.use("/api", gameRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Rota não encontrada." });
});

app.use(errorHandler);

export default app;
