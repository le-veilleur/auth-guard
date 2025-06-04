import winston from "winston";

/**
 * Crée l'instance du logger avec configuration console uniquement
 */
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss:SSS'
    }),
    winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    // Console seulement pour éviter les problèmes de permissions
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ],
});

/**
 * Exporte l'instance du logger pour l'utiliser dans toute l'application
 */
export default logger;
