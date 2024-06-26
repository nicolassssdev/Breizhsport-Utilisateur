# Utilisez une image Node.js légère
FROM node:21.7-alpine3.19

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez le package.json et le package-lock.json pour installer les dépendances
COPY package*.json ./

# Installez toutes les dépendances (y compris les dépendances de développement)
RUN npm install --production

# Installez nodemon globalement
RUN npm install -g nodemon 

# Copiez le reste des fichiers dans le répertoire de travail
COPY . .

# Exposez le port 3000
EXPOSE 3000

# Commande par défaut pour démarrer l'application
CMD ["npm", "start"]
