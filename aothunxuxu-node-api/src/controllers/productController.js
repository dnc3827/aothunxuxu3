const { Op } = require('sequelize');
const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        const { category } = req.query;
        const where = {};

        if (category) {
            where.category = category;
        }

        const products = await Product.findAll({ where });
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Search products with pagination & filtering
// @route   GET /api/products/search
// @access  Public
exports.searchProducts = async (req, res) => {
    try {
        const search = (req.query.search || req.query.searchTerm || '').trim().replace(/\s+/g, ' ');
        const category = req.query.category || '';
        const sortByParam = req.query.sortBy || 'id';
        const isDescending = req.query.isDescending === 'true';
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 12;

        const where = {};
        if (category) where.category = category;
        if (search) {
            // Case-insensitive search (iLike for PostgreSQL)
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }

        // Map frontend sort options to database columns
        let sortBy = 'id';
        let direction = isDescending ? 'DESC' : 'ASC';

        if (sortByParam === 'newest') {
            sortBy = 'id';
            direction = 'DESC';
        } else {
            // Validate allowed columns to prevent SQL injection or errors
            const allowedColumns = ['id', 'name', 'price', 'category', 'createdAt'];
            if (allowedColumns.includes(sortByParam)) {
                sortBy = sortByParam;
            }
        }

        const order = [[sortBy, direction]];
        const offset = (page - 1) * pageSize;

        const { count, rows } = await Product.findAndCountAll({
            where,
            order,
            limit: parseInt(pageSize),
            offset: parseInt(offset)
        });

        res.json({
            items: rows,
            totalCount: count,
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            totalPages: Math.ceil(count / pageSize)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, imageUrl, category } = req.body;

        const product = await Product.create({
            name,
            description,
            price,
            imageUrl,
            category
        });

        res.status(201).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
    try {
        const { name, description, price, imageUrl, category } = req.body;

        let product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product = await product.update({
            name,
            description,
            price,
            imageUrl,
            category
        });

        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.destroy();
        res.json({ message: 'Product removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};
