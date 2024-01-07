const express = require('express');
const router = express.Router();
const controller = require('../controllers/utilisateur');

router.post('/register', controller.registerUser);
router.post('/login', controller.loginUser);

router.get('/', controller.getAllUsers);
router.get('/:user_id', controller.getUserById);

router.put('/:user_id', controller.updateUserById);

router.delete('/:user_id', controller.deleteUserById);

module.exports = router;
