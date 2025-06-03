import express from "express";
import { AuthController } from "../controllers/auth.controller";
import {
  validateRegister,
  validateLogin,
  validateRefreshToken,
  validateLogout
} from "../middlewares/validation.middleware";

// Créer un routeur Express
const router = express.Router();

/**
 * @route POST /register
 * @desc Inscription d'un utilisateur
 */
router.post("/register", ...validateRegister, async (req, res) => {
  await AuthController.register(req, res);
});

/**
 * @route POST /login
 * @desc Connexion utilisateur
 */
router.post("/login", ...validateLogin, async (req, res) => {
  await AuthController.login(req, res);
});

/**
 * @route POST /refresh-token
 * @desc Rafraîchissement du token
 */
router.post("/refresh-token", ...validateRefreshToken, async (req, res) => {
  await AuthController.refreshToken(req, res);
});

/**
 * @route POST /logout
 * @desc Déconnexion utilisateur
 */
router.post("/logout", ...validateLogout, async (req, res) => {
  await AuthController.logout(req, res);
});

export default router;
