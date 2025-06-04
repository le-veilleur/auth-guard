# Image de base Node.js sécurisée
FROM node:20-alpine3.19

# Installation + mises à jour de sécurité
RUN apk update && apk upgrade && apk add --no-cache dumb-init \
    && addgroup -g 1001 -S nodejs \
    && adduser -S nextjs -u 1001

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

# Créer dossier logs avec bonnes permissions
RUN mkdir -p logs && chown -R nextjs:nodejs /app
USER nextjs

# Exposition du port
EXPOSE 3001

# Lancement en mode développement
CMD ["dumb-init", "npm", "run", "dev"] 