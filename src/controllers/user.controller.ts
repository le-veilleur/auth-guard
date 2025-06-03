import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserController {
  /**
   * Récupérer le profil de l'utilisateur connecté
   */
  static async getProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isEmailVerified: true,
          isTwoFactorEnabled: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ user });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res
          .status(500)
          .json({ message: `Error fetching profile: ${error.message}` });
      } else {
        return res
          .status(500)
          .json({ message: 'An unknown error occurred while fetching profile' });
      }
    }
  }

  /**
   * Mettre à jour le profil utilisateur
   */
  static async updateProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { firstName, lastName } = req.body;

      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: {
          firstName,
          lastName,
          updatedAt: new Date()
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isEmailVerified: true,
          isTwoFactorEnabled: true,
          updatedAt: true
        }
      });

      return res.status(200).json({ 
        message: 'Profile updated successfully', 
        user: updatedUser 
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res
          .status(500)
          .json({ message: `Error updating profile: ${error.message}` });
      } else {
        return res
          .status(500)
          .json({ message: 'An unknown error occurred while updating profile' });
      }
    }
  }
} 