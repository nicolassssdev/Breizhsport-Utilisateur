const { DataTypes, Model } = require('sequelize');
const passwordValidator = require('password-validator');
const emailValidator = require('email-validator');

const sequelize = require('../config/database');

const schema = new passwordValidator();

schema
  .is().min(8)
  .is().max(100)
  .has().uppercase()
  .has().lowercase()
  .has().digits(1)
  .has().symbols(1)
  .has().not().spaces();

class Utilisateur extends Model {
  async validateUniqueUsername(username) {
    const existingUser = await Utilisateur.findOne({ where: { username: username } });

    if (existingUser) {
      throw new Error('Le nom d\'utilisateur est déjà pris.');
    }

    return username;
  }

  async validatePassword(password) {
    if (!schema.validate(password)) {
      throw new Error('Le mot de passe ne respecte pas les contraintes de complexité.');
    }

    return await password;
  }

  validateEmail(email) {
    if (!emailValidator.validate(email)) {
      throw new Error('L\'adresse e-mail n\'est pas valide.');
    }
    return email;
  }
}

Utilisateur.init(
  {
     user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
     },
     username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
     },
     hash_password: {
        type: DataTypes.STRING,
        allowNull: false,
     },
     email: {
        type: DataTypes.STRING,
        allowNull: true, 
     },
     is_confirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
     },
     picture_url: {
        type: DataTypes.STRING,
        allowNull: true,
     },
     role: {
        type: DataTypes.INTEGER,
        allowNull: true, 
     },
  },
  {
    sequelize,
    modelName: 'Utilisateurs',
    timestamps: false,
  }
);

module.exports = Utilisateur;
