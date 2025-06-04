import { config } from 'dotenv';

// Charger les variables d'environnement pour les tests
config({ path: '.env.test' });

// Configuration globale pour les tests
beforeAll(async () => {
  // Setup global pour tous les tests
});

afterAll(async () => {
  // Cleanup global après tous les tests
});

// Variables d'environnement par défaut pour les tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key';
process.env.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'test_refresh_secret';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/authguard_test'; 