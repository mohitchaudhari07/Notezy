const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const verifyJWT = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { registerValidator, loginValidator } = require('../validators/auth.validator');

// Public routes
router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);
router.post('/refresh', authController.refresh);

// Protected routes
router.post('/logout', verifyJWT, authController.logout);
router.get('/me', verifyJWT, authController.getMe);

module.exports = router;
