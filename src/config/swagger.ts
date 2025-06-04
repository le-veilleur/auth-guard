import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { config } from './config';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AuthGuard API',
      version: '1.0.0',
      description: 'API d\'authentification sécurisée développée avec Node.js et TypeScript',
      contact: {
        name: 'Maxime Louis',
        url: 'https://www.linkedin.com/in/maxime-l-5530941b5/',
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: config.app.env === 'development' ? 'Development server' : 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID unique de l\'utilisateur',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Adresse email de l\'utilisateur',
            },
            firstName: {
              type: 'string',
              description: 'Prénom de l\'utilisateur',
            },
            lastName: {
              type: 'string',
              description: 'Nom de famille de l\'utilisateur',
            },
            role: {
              type: 'string',
              enum: ['USER', 'ADMIN'],
              description: 'Rôle de l\'utilisateur',
            },
            isEmailVerified: {
              type: 'boolean',
              description: 'Statut de vérification de l\'email',
            },
            isTwoFactorEnabled: {
              type: 'boolean',
              description: 'Statut de l\'authentification à deux facteurs',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création du compte',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de dernière mise à jour',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Login successful',
            },
            result: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                  description: 'Token JWT pour l\'authentification',
                },
                refreshToken: {
                  type: 'string',
                  description: 'Token de rafraîchissement',
                },
                user: {
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Message d\'erreur',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string' },
                  value: { type: 'string' },
                  msg: { type: 'string' },
                  path: { type: 'string' },
                  location: { type: 'string' },
                },
              },
              description: 'Détails des erreurs de validation',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Chemins vers les fichiers contenant les annotations
};

export const specs = swaggerJsdoc(options);
export { swaggerUi }; 