/**
 * Modèle d'utilisateur pour l'application AuthGuard
 * Ce fichier définit les interfaces et la classe pour gérer les utilisateurs
 */

import { Role } from "@prisma/client";

/**
 * Interface principale représentant un utilisateur complet dans la base de données
 * @interface IUser
 * @property {number} id - Identifiant unique de l'utilisateur
 * @property {string} email - Adresse email de l'utilisateur (unique)
 * @property {string} password - Mot de passe hashé de l'utilisateur
 * @property {string} [firstName] - Prénom de l'utilisateur (optionnel)
 * @property {string} [lastName] - Nom de famille de l'utilisateur (optionnel)
 * @property {Role} role - Rôle de l'utilisateur (USER ou ADMIN)
 * @property {boolean} isEmailVerified - Indique si l'email a été vérifié
 * @property {boolean} isTwoFactorEnabled - Indique si l'authentification à deux facteurs est activée
 * @property {string} [twoFactorSecret] - Secret pour l'authentification à deux facteurs (optionnel)
 * @property {string} [refreshToken] - Token pour rafraîchir le JWT (optionnel)
 * @property {Date} createdAt - Date de création de l'utilisateur
 * @property {Date} updatedAt - Date de dernière mise à jour de l'utilisateur
 */
export interface IUser {
  id: number;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: Role;
  isEmailVerified: boolean;
  isTwoFactorEnabled: boolean;
  twoFactorSecret?: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface pour la création d'un nouvel utilisateur
 * Contient uniquement les champs nécessaires à la création
 * @interface IUserCreate
 * @property {string} email - Adresse email de l'utilisateur
 * @property {string} password - Mot de passe en clair (sera hashé avant stockage)
 * @property {string} [firstName] - Prénom de l'utilisateur (optionnel)
 * @property {string} [lastName] - Nom de famille de l'utilisateur (optionnel)
 * @property {Role} [role] - Rôle de l'utilisateur (par défaut: USER)
 */
export interface IUserCreate {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
}

/**
 * Interface pour la mise à jour d'un utilisateur existant
 * Tous les champs sont optionnels car on peut ne vouloir mettre à jour que certains champs
 * @interface IUserUpdate
 * @property {string} [email] - Nouvelle adresse email
 * @property {string} [password] - Nouveau mot de passe
 * @property {string} [firstName] - Nouveau prénom
 * @property {string} [lastName] - Nouveau nom de famille
 * @property {Role} [role] - Nouveau rôle
 * @property {boolean} [isEmailVerified] - État de vérification de l'email
 * @property {boolean} [isTwoFactorEnabled] - État de l'authentification à deux facteurs
 * @property {string} [twoFactorSecret] - Nouveau secret pour l'authentification à deux facteurs
 * @property {string} [refreshToken] - Nouveau token de rafraîchissement
 */
export interface IUserUpdate {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
  isEmailVerified?: boolean;
  isTwoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  refreshToken?: string;
}

/**
 * Classe User implémentant l'interface IUser
 * Permet d'instancier des objets User avec validation des types
 * @class User
 * @implements {IUser}
 */
export class User implements IUser {
  // Propriétés de la classe avec leurs types
  id: number;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: Role;
  isEmailVerified: boolean;
  isTwoFactorEnabled: boolean;
  twoFactorSecret?: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;

  /**
   * Crée une instance de User
   * @constructor
   * @param {IUser} data - Données de l'utilisateur
   */
  constructor(data: IUser) {
    // Initialisation des propriétés avec les données fournies
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.role = data.role;
    this.isEmailVerified = data.isEmailVerified;
    this.isTwoFactorEnabled = data.isTwoFactorEnabled;
    this.twoFactorSecret = data.twoFactorSecret;
    this.refreshToken = data.refreshToken;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
