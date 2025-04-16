import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

/**
 * Charge les variables d'environnement depuis le fichier .env
 * Permet d'accéder à DATABASE_URL et d'autres variables de configuration
 */
dotenv.config();

/**
 * Création d'une instance du client Prisma
 *
 * La configuration des logs dépend de l'environnement :
 * - En développement : logs complets pour faciliter le débogage
 * - En production : uniquement les erreurs pour éviter la surcharge
 */
const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"] // Active tous les types de logs en développement
      : ["error"] // Uniquement les erreurs en production
});

/**
 * Fonction asynchrone pour se connecter à la base de données
 *
 * Gère la connexion et les erreurs potentielles
 * Arrête l'application en cas d'échec de connexion pour éviter les problèmes en cascade
 */
export const connectDB = async (): Promise<void> => {
  try {
    // Tente d'établir la connexion
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    // En cas d'échec, affiche l'erreur et arrête l'application
    console.error("Database connection error:", error);
    process.exit(1); // Code de sortie 1 indique une erreur
  }
};

/**
 * Exporte l'instance du client Prisma pour l'utiliser dans d'autres fichiers
 * Cette instance unique sera partagée dans toute l'application (pattern Singleton)
 */
export default prisma;
