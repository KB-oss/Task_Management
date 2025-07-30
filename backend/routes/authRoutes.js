const express = require('express');
const router = express.Router();
const { register, login, getAllUsers } = require('../controllers/authController');


// Register route
router.post('/register', register);
// Login route
router.post('/login', login);
router.get('/', getAllUsers);

module.exports = router;
