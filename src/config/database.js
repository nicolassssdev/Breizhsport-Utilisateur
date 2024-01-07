const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('breizhsport', 'root', 'root', {
    host: 'mysql',
    dialect: 'mysql',
    port: '3306',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });

// Vérification de la connexion à la base de données
sequelize.authenticate()
  .then(() => {
    console.log('Connexion à la base de données établie avec succès.');
  })
  .catch(err => {
    console.error('Erreur de connexion à la base de données:', err);
  });

module.exports = sequelize;
