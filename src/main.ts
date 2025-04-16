import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";
import { connectDB } from "./config/database";
import logger from "./config/logger";
import { setupMiddlewares, errorHandler, notFoundHandler } from "./middlewares";
import routes from "./routes";

// Chargement des variables d'environnement
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

async function startServer() {
  try {
    // Connexion à la base de données
    await connectDB();
    logger.info("Database connected successfully");

    // Sécurité et middlewares de parsing
    app.use(helmet());

    app.use(
      cors({
        origin: process.env.CORS_ORIGIN || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
      })
    );

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan("dev"));

    // Limitation du nombre de requêtes
    const limiter = rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000"),
      max: parseInt(process.env.RATE_LIMIT_MAX || "10"),
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: "Too many requests, please try again later." }
    });

    app.use(limiter);

    // Health check
    app.get("/api/health", (_, res) => {
      res
        .status(200)
        .json({ status: "ok", message: "AuthGuard API is running" });
    });

    // Middlewares personnalisés
    setupMiddlewares(app);

    // Routes
    app.use("/api", routes);

    // Gestion des erreurs
    app.use(errorHandler);
    app.use(notFoundHandler);

    // Démarrage du serveur
    app.listen(port, () => {
      logger.info(`AuthGuard API running on port ${port}`);
      logger.info(
        `Health check available at http://localhost:${port}/api/health`
      );
    });
  } catch (error) {
    logger.error("Error during server startup:", error);
    process.exit(1);
  }
}

startServer();

export default app;
