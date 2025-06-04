import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { IUserCreate } from '../models/User';

export class AuthController {
  /**
   * Inscription d'un nouvel utilisateur
   */
  static async register(req: Request, res: Response) {
    try {
      const userData: IUserCreate = req.body;
      const user = await AuthService.register(userData);
      return res
        .status(201)
        .json({ message: 'User successfully registered', user });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res
          .status(400)
          .json({ message: `Registration failed: ${error.message}` });
      } else {
        return res
          .status(400)
          .json({ message: 'An unknown error occurred during registration' });
      }
    }
  }

  /**
   * Connexion utilisateur
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      return res.status(200).json({ message: 'Login successful', result });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res
          .status(401)
          .json({ message: `Login failed: ${error.message}` });
      } else {
        return res
          .status(401)
          .json({ message: 'An unknown error occurred during login' });
      }
    }
  }

  /**
   * Rafraîchissement du token
   */
  static async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      const result = await AuthService.refreshToken(refreshToken);
      return res
        .status(200)
        .json({ message: 'Token refreshed successfully', result });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res
          .status(401)
          .json({ message: `Token refresh failed: ${error.message}` });
      } else {
        return res
          .status(401)
          .json({ message: 'An unknown error occurred during token refresh' });
      }
    }
  }

  /**
   * Déconnexion (invalidation du refresh token)
   */
  static async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      await AuthService.logout(refreshToken);
      return res.status(200).json({ message: 'Logout successful' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res
          .status(400)
          .json({ message: `Logout failed: ${error.message}` });
      } else {
        return res
          .status(400)
          .json({ message: 'An unknown error occurred during logout' });
      }
    }
  }
} 