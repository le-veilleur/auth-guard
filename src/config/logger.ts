import winston from "winston";
import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";
import path from "path";
import dotenv from "dotenv";
import moment from "moment-timezone";

/**
 * Charge les variables d'environnement depuis le fichier .env
 * Permet d'accéder aux paramètres de configuration du logger
 */
dotenv.config();

/**
 * Définition des niveaux de journalisation
 * Les chiffres représentent la priorité (plus le chiffre est bas, plus le niveau est important)
 */
const levels = {
  error: 0, // Erreurs critiques qui empêchent le fonctionnement normal
  warn: 1, // Avertissements qui n'empêchent pas le fonctionnement mais méritent attention
  info: 2, // Informations sur le fonctionnement normal de l'application
  http: 3, // Détails sur les requêtes HTTP
  debug: 4 // Informations détaillées pour le débogage
};

/**
 * Détermine le niveau de journalisation en fonction de l'environnement
 * - Développement : logs détaillés pour faciliter le débogage
 * - Production : logs minimaux pour éviter de surcharger les fichiers de logs
 *
 * @returns {string} Le niveau de journalisation à utiliser
 */
const level = () => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env === "development";
  // L'opérateur ternaire permet de retourner 'debug' en développement, sinon 'warn'
  return isDevelopment ? "debug" : "warn";
};

/**
 * Définition des couleurs pour chaque niveau de log dans la console
 * Améliore la lisibilité des logs en les différenciant visuellement
 */
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white"
};

/**
 * Ajoute la configuration de couleurs à Winston
 */
winston.addColors(colors);

/**
 * Définit le format des messages de log
 * Combine plusieurs formateurs pour créer un format personnalisé
 */
const logFormat = format.combine(
  format.timestamp(),
  format.colorize({ all: true }),
  format.printf((info) => {
    const timestamp = moment(info.timestamp as string)
      .tz("Europe/Paris")
      .format("YYYY-MM-DD HH:mm:ss:ms");
    return `${timestamp} ${info.level}: ${info.message}`;
  })
);

/**
 * Définit les destinations où les logs seront stockés
 * Utilise plusieurs transporteurs pour différencier le traitement selon le type de log
 */
const transportsConfig = [
  // Console
  new transports.Console(),
  // Fichier pour les erreurs
  new (require("winston-daily-rotate-file"))({
    filename: path.join("logs", "all-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d"
  }),

  // Par celle-ci
  new (require("winston-daily-rotate-file"))({
    filename: path.join("logs", "all-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d"
  })
];

/**
 * Crée l'instance du logger avec la configuration complète
 * Utilise soit le niveau défini dans les variables d'environnement,
 * soit le niveau déterminé par la fonction level()
 */
const logger = createLogger({
  level: level(),
  levels,
  format: logFormat,
  transports: transportsConfig
});

/**
 * Exporte l'instance du logger pour l'utiliser dans toute l'application
 */
export default logger;
