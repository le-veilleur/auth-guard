import { PrismaClient, Role } from '@prisma/client';
import { hash, compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { IUserCreate } from '../models/User';
import { config } from '../config/config';
import { EmailService } from './EmailService';
import * as jwt from 'jsonwebtoken';
import crypto from 'crypto';

const prisma = new PrismaClient();

export class AuthService {
  private static readonly SALT_ROUNDS = 10;
  private static readonly JWT_SECRET = config.jwt.secret;
  private static readonly JWT_EXPIRES_IN = config.jwt.expiresIn;
  private static readonly REFRESH_TOKEN_EXPIRES_IN = '7d';

  static async register(userData: IUserCreate) {
    const hashedPassword = await hash(userData.password, this.SALT_ROUNDS);
    
    // Générer un token de vérification d'email
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        role: userData.role || Role.USER,
        emailVerificationToken,
        emailVerificationExpires,
      },
    });

    // Envoyer l'email de vérification
    try {
      await EmailService.sendVerificationEmail(user.email, emailVerificationToken);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // On ne fait pas échouer l'inscription si l'email ne part pas
    }

    // Retourner l'utilisateur sans les données sensibles
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      isTwoFactorEnabled: user.isTwoFactorEnabled,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  static async refreshToken(refreshToken: string) {
    const decoded = verify(refreshToken, this.JWT_SECRET) as { id: number };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.refreshToken !== refreshToken) {
      throw new Error('Invalid refresh token');
    }

    const newAccessToken = this.generateAccessToken(user);
    return { accessToken: newAccessToken };
  }

  static async logout(refreshToken: string) {
    const decoded = verify(refreshToken, this.JWT_SECRET) as { id: number };
    
    await prisma.user.update({
      where: { id: decoded.id },
      data: { refreshToken: null },
    });

    return { message: 'User logged out successfully' };
  }

  /**
   * Vérifier l'email avec le token
   */
  static async verifyEmail(token: string) {
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      }
    });

    return { message: 'Email verified successfully' };
  }

  /**
   * Demander un reset de mot de passe
   */
  static async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Pour des raisons de sécurité, on ne révèle pas si l'email existe
      return { message: 'If the email exists, a reset link has been sent' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1h

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: resetToken, // Réutilise le même champ
        emailVerificationExpires: resetExpires,
      }
    });

    try {
      await EmailService.sendPasswordResetEmail(user.email, resetToken);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new Error('Failed to send reset email');
    }

    return { message: 'If the email exists, a reset link has been sent' };
  }

  /**
   * Réinitialiser le mot de passe
   */
  static async resetPassword(token: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    const hashedPassword = await hash(newPassword, this.SALT_ROUNDS);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        refreshToken: null, // Invalider tous les refresh tokens
      }
    });

    return { message: 'Password reset successfully' };
  }

  private static generateAccessToken(user: { id: number; role: Role }) {
    return sign(
      { id: user.id, role: user.role },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN } as jwt.SignOptions
    );
  }

  private static generateRefreshToken(user: { id: number }) {
    return sign(
      { id: user.id },
      this.JWT_SECRET,
      { expiresIn: this.REFRESH_TOKEN_EXPIRES_IN } as jwt.SignOptions
    );
  }
} 