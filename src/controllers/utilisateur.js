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
        console.error('Erreur dans le middleware handleErrors:', error);

        if (res.headersSent) {
          return next(error);
        }

        res.status(500).json({ error: { message: 'Une erreur est survenue' } });
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

      await createdUser.validateUniqueUsername(username);
      await createdUser.validatePassword(password);
      await createdUser.validateEmail(email);

      createdUser.hash_password = await bcrypt.hash(password, 10);

      await createdUser.save();

      res.status(201).json(createdUser);
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur', error);
      res.status(500).json({ error: { message: error.message } });
    }
  });
  
  // Fonction pour authentifier un utilisateur
  loginUser = this.handleErrors(async (req, res) => {
    try {
      let user = await this.getUserByUsernameOrEmail(req.body.login, res);
      console.log(req.body.password);
      console.log("résultat du user", user);
      if (user && (await bcrypt.compare(req.body.password, user.hash_password))) {
        res.status(200).json({ message: 'Authentification réussie' });
      } else {
        res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
      }
    } catch (error) {
      console.error('Erreur lors de l\'authentification de l\'utilisateur', error);
      res.status(500).json({ error: { message: error.message } });
    }
  });

  // Fonction pour récupérer tous les utilisateurs
  getAllUsers = this.handleErrors(async (req, res) => {
    const users = await Utilisateur.findAll();
    res.status(200).json(users);
  });

  // Fonction pour récupérer un utilisateur par son ID
  getUserById = this.handleErrors(async (req, res) => {
    const user = await Utilisateur.findByPk(req.params.user_id);

    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
    } else {
      res.status(200).json(user);
    }
  });

  // Fonction pour récupérer un utilisateur par son username ou email
  getUserByUsernameOrEmail = (async (login) => {
    let user = await Utilisateur.findOne({
      where: { username: login },
    });
  
    if (!user) {
      user = await Utilisateur.findOne({
        where: { email: login },
      });
    }
    console.log(user)
    return user;
  });
  
  
  
  // Fonction pour récupérer un utilisateur par son ID
  getUserById = this.handleErrors(async (req, res) => {
    const user = await Utilisateur.findByPk(req.params.user_id);
    
    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
    } else {
      res.status(200).json(user);
    }
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
