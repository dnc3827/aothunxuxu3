const { validationResult } = require('express-validator');

// Middleware to handle validation results
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('[DEBUG] Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
