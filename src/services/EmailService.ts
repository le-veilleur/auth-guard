/**
 * Service d'envoi d'e-mails pour l'application AuthGuard
 * Utilise Nodemailer pour l'envoi d'e-mails
 */

import nodemailer from 'nodemailer';
import { config } from '../config/config';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port === 465, // true pour le port 465, false pour les autres
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });

  /**
   * Envoie un e-mail de vérification à un utilisateur
   * @param {string} email - Adresse e-mail du destinataire
   * @param {string} verificationToken - Token de vérification
   * @returns {Promise<void>}
   */
  static async sendVerificationEmail(email: string, verificationToken: string): Promise<void> {
    const verificationUrl = `${config.app.baseUrl}/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: `"AuthGuard" <${config.email.user}>`,
      to: email,
      subject: 'Vérification de votre adresse e-mail',
      html: `
        <h1>Bienvenue sur AuthGuard</h1>
        <p>Merci de vous être inscrit. Veuillez cliquer sur le lien ci-dessous pour vérifier votre adresse e-mail :</p>
        <a href="${verificationUrl}">Vérifier mon e-mail</a>
        <p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet e-mail.</p>
        <p>Ce lien expirera dans 24 heures.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail de vérification:', error);
      throw new Error('Impossible d\'envoyer l\'e-mail de vérification');
    }
  }

  /**
   * Envoie un e-mail de réinitialisation de mot de passe
   * @param {string} email - Adresse e-mail du destinataire
   * @param {string} resetToken - Token de réinitialisation
   * @returns {Promise<void>}
   */
  static async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${config.app.baseUrl}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"AuthGuard" <${config.email.user}>`,
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      html: `
        <h1>Réinitialisation de mot de passe</h1>
        <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous pour continuer :</p>
        <a href="${resetUrl}">Réinitialiser mon mot de passe</a>
        <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet e-mail.</p>
        <p>Ce lien expirera dans 1 heure.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail de réinitialisation:', error);
      throw new Error('Impossible d\'envoyer l\'e-mail de réinitialisation');
    }
  }
} 