const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const userRoutes = require('./routes/utilisateur');

const app = express();

const packageJsonPath = path.join('package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const apiVersion = packageJson.version;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Middleware pour ajouter la version de l'API aux entêtes HTTP
app.use((req, res, next) => {
  res.setHeader('X-API-Version', apiVersion);
  next();
});

app.use('/user', userRoutes);

app.get('/', (req, res) => {
    res.send(`Bienvenue sur mon API Breizhsport Utilisateur Ugur !`);
});

// Middleware pour gérer les erreurs 404
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// Middleware pour gérer les erreurs générales
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
