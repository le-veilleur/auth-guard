# Image de base Node.js
FROM node:20-alpine

# Installation + mises à jour de sécurité
RUN apk update && apk upgrade && apk add --no-cache dumb-init

# Répertoire de travail
WORKDIR /app

# Copie des fichiers de configuration
COPY package*.json ./
COPY tsconfig.json ./

# Installation des dépendances
RUN npm install

# Copie du schema Prisma
COPY prisma ./prisma/

# Génération du client Prisma
RUN npx prisma generate

# Copie du code source
COPY src ./src

# Exposition du port
EXPOSE 3000

# Lancement en mode développement
CMD ["dumb-init", "npm", "run", "dev"] 