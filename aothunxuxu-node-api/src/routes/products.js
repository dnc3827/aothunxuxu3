const express = require('express');
const {
    getProducts,
    getProductById,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const { body } = require('express-validator');
const { validate } = require('../utils/validator');
const { importProducts, parseImport, confirmImport } = require('../controllers/importController');
const multer = require('multer');
const os = require('os');
const upload = multer({ dest: os.tmpdir() });

const router = express.Router();

// Validation rules
const productValidation = [
    body('name').notEmpty().withMessage('Product name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').notEmpty().withMessage('Category is required'),
    validate
];

// Public routes
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductById);

// Protected Admin routes
router.post('/', protect, authorize('Admin'), productValidation, createProduct);
router.put('/:id', protect, authorize('Admin'), productValidation, updateProduct);
router.delete('/:id', protect, authorize('Admin'), deleteProduct);

// Smart Import (2-phase)
router.post('/import/parse', protect, authorize('Admin'), upload.single('file'), parseImport);
router.post('/import/confirm', protect, authorize('Admin'), confirmImport);

// Legacy import (backward-compatible)
router.post('/import', protect, authorize('Admin'), upload.single('file'), importProducts);

module.exports = router;
