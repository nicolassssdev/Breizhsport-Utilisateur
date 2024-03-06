const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('breizhsport', 'dev', 'azerty', {
  host: '172.16.47.100',
  dialect: 'mysql',
  port: '3306',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

// Vérification de la connexion à la base de données
sequelize.authenticate()
  .then(() => {
    console.log('Connexion à la base de données établie avec succès.')
  })
  .catch(err => {
    console.error('Erreur de connexion à la base de données:', err)
  })

module.exports = sequelize
