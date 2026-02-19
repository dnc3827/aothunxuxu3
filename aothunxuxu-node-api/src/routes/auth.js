const express = require('express');
const { login, registerAdmin } = require('../controllers/authController');
const { body } = require('express-validator');
const { validate } = require('../utils/validator');

const router = express.Router();

router.post('/login', [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
], login);

router.post('/register-admin', [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate
], registerAdmin);

router.post('/register', [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate
], require('../controllers/authController').register);

module.exports = router;
