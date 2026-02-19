const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check for user
        const user = await User.findOne({ where: { username } });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Create token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Register a new user (Standard)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    console.log('[DEBUG] Register payload:', req.body);
    const { username, password, inviteCode } = req.body;

    try {
        // Check if user exists
        const userExists = await User.findOne({ where: { username } });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // All new registrations are 'User' by default.
        // Admin role is reserved for the hardcoded account only.
        const role = 'User';

        const user = await User.create({
            username,
            passwordHash: password,
            role: role
        });

        // Create token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(201).json({
            message: role === 'Admin' ? 'Admin registered successfully' : 'User registered successfully',
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Register first Admin (Utility)
// @route   POST /api/auth/register-admin
// @access  Public
exports.registerAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if any user exists
        const userCount = await User.count();

        if (userCount > 0) {
            return res.status(400).json({ message: 'Admin registration is only allowed for the first user.' });
        }

        const user = await User.create({
            username,
            passwordHash: password, // Model hook will hash this
            role: 'Admin'
        });

        res.status(201).json({
            message: 'Admin registered successfully',
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};
