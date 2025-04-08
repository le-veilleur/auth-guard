# 🔐 AuthGuard

**AuthGuard** est une API d'authentification sécurisée développée avec **Node.js** et **TypeScript**.  
Elle vise à proposer une base robuste pour sécuriser l'accès à vos applications web ou mobiles.

---

## ✨ Fonctionnalités

- ✅ Inscription et connexion avec e-mail + mot de passe  
- ✅ Hash sécurisé des mots de passe (bcrypt ou argon2)  
- ✅ Gestion des tokens JWT (access + refresh)  
- ✅ Authentification à deux facteurs (2FA via TOTP)  
- ✅ Protection contre les attaques brute-force (rate limiting)  
- ✅ Déconnexion sécurisée  
- ✅ Middleware de protection des routes  
- ✅ Gestion des rôles (RBAC) *(optionnel, à venir)*  

---

## 🧱 Stack Technique

- **Langage** : TypeScript  
- **Backend** : Node.js + Express  
- **Base de données** : PostgreSQL (via Prisma ou autre ORM)  
- **Sécurité** : Bcrypt / Argon2, JWT, TOTP (2FA)  
- **Middleware** : Rate limiting, validation de requêtes  

---

## 🚀 Lancement local

```bash
# Clone le repo
git clone https://github.com/ton-utilisateur/authguard.git
cd authguard

# Installe les dépendances
npm install

# Configure les variables d'environnement
cp .env.example .env

# Lance le serveur
npm run dev
```

⚙️ Configuration `.env`

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/authguard
JWT_SECRET=une_clé_secrète_sécurisée
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=une_autre_clé_plus_longue
REFRESH_TOKEN_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=10
TOTP_SECRET=clé_totp_à_remplacer
```

📁 Structure du projet (proposition)

```
src/
├── config/         # Config de l'app (DB, env, etc)
├── controllers/    # Handlers des routes
├── middlewares/    # Middlewares Express
├── models/         # Schémas ou ORM
├── routes/         # Routes Express
├── services/       # Logique métier
├── utils/          # Fonctions utilitaires
└── index.ts        # Point d'entrée
```

## 🔒 Sécurité

* Mots de passe hashés avec un algo sécurisé
* Tokens signés et vérifiés avec secret + expiration
* Rate limiting pour bloquer les attaques par force brute
* Authentification à deux facteurs via OTP

## 📌 À venir

* 📊 Dashboard d'administration
* 🧩 Intégration OAuth (Google, GitHub…)
* 🔐 Gestion des permissions avancées (RBAC/ABAC)
* 📧 Vérification d'e-mail

## 📄 Licence

Ce projet est sous licence MIT – libre à utiliser et adapter pour vos besoins.

## 🙋‍♂️ Auteur

Développé par **Maxime Louis**, développeur backend passionné par la sécurité et les architectures robustes.
📬 Contact : [LinkedIn](https://www.linkedin.com/in/maxime-l-5530941b5/)
