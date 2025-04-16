/**
 * Middleware d'authentification pour l'application AuthGuard
 * Ce middleware vérifie la validité des tokens JWT et attache l'utilisateur à la requête
 */

import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { config } from "../config/config";

// Instance de PrismaClient pour interagir avec la base de données
const prisma = new PrismaClient();

/**
 * Middleware d'authentification qui vérifie la présence et la validité du token JWT
 * @async
 * @function authMiddleware
 * @param {Request} req - Objet Request d'Express
 * @param {Response} res - Objet Response d'Express
 * @param {NextFunction} next - Fonction next d'Express
 * @returns {Promise<void>}
 * @throws {Error} Si le token est invalide ou l'utilisateur n'existe pas
 */

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Vérification de la présence du header d'autorisation
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Extraction du token du header (format: "Bearer <token>")
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token format invalid" });
    }

    // Vérification et décodage du token JWT
    const decoded = verify(token, config.jwt.secret) as {
      id: number;
      role: string;
    };

    // Recherche de l'utilisateur dans la base de données
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    // Vérification de l'existence de l'utilisateur
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attachement de l'utilisateur à l'objet request pour utilisation dans les routes
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    // Passage au middleware suivant
    next();
  } catch (error) {
    // Gestion des erreurs de vérification du token
    return res.status(401).json({ message: "Invalid token" });
  }
};

/**
 * Extension du type Request d'Express pour inclure l'utilisateur authentifié
 * @namespace Express
 * @interface Request
 */
declare global {
  namespace Express {
    interface Request {
      /**
       * Informations de l'utilisateur authentifié
       * @type {Object}
       * @property {number} id - Identifiant de l'utilisateur
       * @property {string} email - Email de l'utilisateur
       * @property {string} role - Rôle de l'utilisateur
       */
      user?: {
        id: number;
        email: string;
        role: string;
      };
    }
  }
}
