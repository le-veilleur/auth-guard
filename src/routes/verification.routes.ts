/**
 * Routes pour la vérification d'e-mail
 */

import express from "express";
import { PrismaClient } from "@prisma/client";
import { EmailService } from "../services/EmailService";
import { randomBytes } from "crypto";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * Envoie un e-mail de vérification à un utilisateur
 * @route POST /send-verification
 */

router.post("/send-verification", (req, res) => {
  const handleSendVerification = async () => {
    try {
      const { email } = req.body;
      // Vérifier si l'utilisateur existe
      const user = await prisma.user.findUnique({
        where: { email }
      });
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      if (user.isEmailVerified) {
        return res.status(400).json({ message: "E-mail déjà vérifié" });
      }
      // Générer un token de vérification
      const verificationToken = randomBytes(32).toString("hex");
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures
      // Mettre à jour l'utilisateur avec le token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerificationToken: verificationToken,
          emailVerificationExpires: verificationExpires
        }
      });
      // Envoyer l'e-mail de vérification
      await EmailService.sendVerificationEmail(email, verificationToken);
      res.json({ message: "E-mail de vérification envoyé" });
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi de l'e-mail de vérification:",
        error
      );
      res
        .status(500)
        .json({
          message: "Erreur lors de l'envoi de l'e-mail de vérification"
        });
    }
  };

  handleSendVerification();
});

/**
 * Vérifie l'e-mail d'un utilisateur avec le token
 * @route GET /verify-email
 */

router.get("/verify-email", (req, res) => {
  const handleVerifyEmail = async () => {
    try {
      const { token } = req.query;
      if (!token) {
        return res.status(400).json({ message: "Token manquant" });
      }
      // Trouver l'utilisateur avec le token
      const user = await prisma.user.findFirst({
        where: {
          emailVerificationToken: token as string,
          emailVerificationExpires: {
            gt: new Date()
          }
        }
      });
      if (!user) {
        return res.status(400).json({ message: "Token invalide ou expiré" });
      }
      // Mettre à jour l'utilisateur
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isEmailVerified: true,
          emailVerificationToken: null,
          emailVerificationExpires: null
        }
      });
      res.json({ message: "E-mail vérifié avec succès" });
    } catch (error) {
      console.error("Erreur lors de la vérification de l'e-mail:", error);
      res
        .status(500)
        .json({ message: "Erreur lors de la vérification de l'e-mail" });
    }
  };

  handleVerifyEmail();
});

export default router;
