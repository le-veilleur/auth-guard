import express from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * @route GET /profile
 * @desc Récupérer le profil de l'utilisateur connecté
 * @access Private
 */
router.get("/profile", authMiddleware, async (req, res) => {
  await UserController.getProfile(req, res);
});

/**
 * @route PUT /profile
 * @desc Mettre à jour le profil utilisateur
 * @access Private
 */
router.put("/profile", authMiddleware, async (req, res) => {
  await UserController.updateProfile(req, res);
});

export default router; 