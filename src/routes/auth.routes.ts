import express from "express";
import { AuthService } from "../services/AuthService";
import { IUserCreate } from "../models/User";

// Créer un routeur Express
const router = express.Router();

/**
 * @route POST /register
 * @desc Inscription d'un utilisateur
 */
router.post("/register", (req, res) => {
  const handleRegister = async () => {
    try {
      const reqBody = req.body;
      if (!reqBody || typeof reqBody !== "object") {
        return res.status(400).json({ message: "Invalid request body" });
      }
      const userData: IUserCreate = req.body;

      if (!userData.email || !userData.password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const user = await AuthService.register(userData);
      return res
        .status(201)
        .json({ message: "User successfully registered", user });
    } catch (error: any) {
      return res
        .status(400)
        .json({ message: `Registration failed: ${error.message}` });
    }
  };

  handleRegister();
});

/**
 * @route POST /login
 * @desc Connexion utilisateur
 */
router.post("/login", (req, res) => {
  const handleLogin = async () => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const result = await AuthService.login(email, password);
      return res.status(200).json({ message: "Login successful", result });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res
          .status(401)
          .json({ message: `Login failed: ${error.message}` });
      } else {
        return res
          .status(401)
          .json({ message: "An unknown error occurred during login" });
      }
    }
  };

  handleLogin();
});

/**
 * @route POST /refresh-token
 * @desc Rafraîchissement du token
 */
router.post("/refresh-token", (req, res) => {
  const handleRefreshToken = async () => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
      }

      const result = await AuthService.refreshToken(refreshToken);
      return res
        .status(200)
        .json({ message: "Token refreshed successfully", result });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res
          .status(401)
          .json({ message: `Token refresh failed: ${error.message}` });
      } else {
        return res
          .status(401)
          .json({ message: "An unknown error occurred during token refresh" });
      }
    }
  };

  handleRefreshToken();
});

export default router;
