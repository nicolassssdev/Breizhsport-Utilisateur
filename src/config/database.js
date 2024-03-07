const { Sequelize } = require('sequelize')

require('dotenv').config();

const databaseName = process.env.DATABASE_NAME
const user = process.env.USERNAME
const password = process.env.PASSWORD
const port = process.env.PORT
const host = process.env.HOST


const sequelize = new Sequelize(databaseName, user, password, {
  host: host,
  dialect: 'mysql',
  port: port,
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
