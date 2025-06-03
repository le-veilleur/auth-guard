import { PrismaClient, Role } from '@prisma/client';
import { hash, compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { IUserCreate } from '../models/User';
import { config } from '../config/config';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export class AuthService {
  private static readonly SALT_ROUNDS = 10;
  private static readonly JWT_SECRET = config.jwt.secret;
  private static readonly JWT_EXPIRES_IN = config.jwt.expiresIn;
  private static readonly REFRESH_TOKEN_EXPIRES_IN = '7d';

  static async register(userData: IUserCreate) {
    const hashedPassword = await hash(userData.password, this.SALT_ROUNDS);
    
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        role: userData.role || Role.USER,
      },
    });

    // TODO: Send verification email
    return user;
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