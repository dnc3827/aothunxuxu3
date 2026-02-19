const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const sequelize = require('./config/database');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests without Origin (curl, mobile apps, server-to-server).
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
    console.log(`>>> ${req.method} ${req.url}`);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Backend API is running',
        docs: ['/api/products', '/api/auth/login', '/api/images/upload']
    });
});

const fs = require('fs');
const logError = (type, err) => {
    const message = `[${new Date().toISOString()}] ${type}: ${err.message}\n${err.stack}\n---\n`;
    try {
        fs.appendFileSync(path.join(__dirname, '..', 'crash_report.log'), message);
    } catch (e) { }
    console.error(message);
};

process.on('unhandledRejection', (err) => {
    logError('UNHANDLED REJECTION', err);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    logError('UNCAUGHT EXCEPTION', err);
    process.exit(1);
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/images', require('./routes/images'));

const startServer = async () => {
    try {
        console.log('Starting server...');
        await sequelize.authenticate();
        console.log('Database connected.');

        const shouldAlterSchema = process.env.DB_SYNC_ALTER === 'true';
        await sequelize.sync(shouldAlterSchema ? { alter: true } : undefined);

        if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
            app.listen(PORT, () => {
                console.log('===============================================');
                console.log(`Server is LIVE on port ${PORT}`);
                console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
                console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
                console.log(`DB sync alter mode: ${shouldAlterSchema}`);
                console.log('===============================================');
            });
        }
    } catch (error) {
        logError('STARTUP ERROR', error);
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }
};

startServer();

module.exports = app;
