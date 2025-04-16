# Développement - Dockerfile
FROM node:20-alpine

# Installation de dumb-init pour une gestion propre des signaux (utile même en dev)
RUN apk add --no-cache dumb-init

# Définition du répertoire de travail
WORKDIR /app

# Copie des fichiers de configuration
COPY package*.json ./
COPY tsconfig.json ./

# Création du dossier prisma et copie du schema
RUN mkdir -p prisma
COPY prisma/schema.prisma ./prisma/

# Installation des dépendances
RUN npm install && \
    npx prisma generate

# Copie du code source
COPY src ./src

# Exposition du port
EXPOSE 3000

# Lancement en mode développement avec dumb-init
CMD ["dumb-init", "npm", "run", "dev"]
