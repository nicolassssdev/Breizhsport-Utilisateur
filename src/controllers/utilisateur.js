const { validationResult } = require('express-validator');
const Utilisateur = require('../models/utilisateur');
const bcrypt = require('bcrypt');

class UtilisateurController {
  // Middleware pour gérer les erreurs
  handleErrors(fn) {
    return async (req, res, next) => {
      try {
        await fn(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  }

  // Fonction pour créer un nouvel utilisateur
  registerUser = this.handleErrors(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { username, password, email, pictureUrl, role } = req.body;

    try {
      const createdUser = new Utilisateur({
        username: username,
        hash_password: password,
        email: email,
        is_confirmed: false,
        pictureUrl,
        role,
      });

      // Validation du nom d'utilisateur
      await createdUser.validateUniqueUsername(username);

      // Validation du mot de passe et hachage
      await createdUser.validatePassword(password);

      // Validation de l'adresse e-mail
      await createdUser.validateEmail(email);
      createdUser.hash_password = await bcrypt.hash(password, 10);
      // Sauvegarde de l'utilisateur en base de données
      await createdUser.save();

      res.status(201).json(createdUser);
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur', error);
      res.status(500).json({ error: { message: error.message } });
    }
  });
  
  
  
  

  // Fonction pour authentifier un utilisateur
  loginUser = this.handleErrors(async (req, res) => {
    // Logique d'authentification ici en fonction de vos besoins
    // Vérification du nom d'utilisateur, du mot de passe, etc.
    // Vous pouvez utiliser bcrypt.compare pour comparer les mots de passe hachés

    res.status(200).json({ message: 'Authentification réussie' });
  });

  // Fonction pour récupérer tous les utilisateurs
  getAllUsers = this.handleErrors(async (req, res) => {
    const users = await Utilisateur.findAll();
    res.status(200).json(users);
  });

  // Fonction pour récupérer un utilisateur par son ID
  getUserById = this.handleErrors(async (req, res) => {
    const user = await Utilisateur.findByPk(req.params.user_id);
    res.status(200).json(user);
  });

  // Fonction pour mettre à jour un utilisateur par son ID
  updateUserById = this.handleErrors(async (req, res) => {
    const [_, updatedUser] = await Utilisateur.update(req.body, {
      where: { user_id: req.params.user_id },
      returning: true,
    });

    res.status(200).json(updatedUser[0]);
  });

  // Fonction pour supprimer un utilisateur par son ID
  deleteUserById = this.handleErrors(async (req, res) => {
    const removedUser = await Utilisateur.destroy({
      where: { user_id: req.params.user_id },
    });

    res.status(200).json(removedUser);
  });
}

module.exports = new UtilisateurController();
