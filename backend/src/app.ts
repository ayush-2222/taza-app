import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import routes from "./routes";
import { env } from "./config/env";
import { healthcheck } from "./controllers/health.controller";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
import { uploadRoot } from "./middlewares/upload";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN.split(",") }));
app.use(compression());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.use("/uploads", express.static(uploadRoot));

app.get("/health", healthcheck);
app.use("/", routes);
app.use(notFoundHandler);
app.use(errorHandler);
