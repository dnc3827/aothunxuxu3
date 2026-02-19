const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');
const pg = require('pg');

dotenv.config();

const hasDatabaseUrl = typeof process.env.DATABASE_URL === 'string' && process.env.DATABASE_URL.trim().length > 0;
const isVercelRuntime = Boolean(process.env.VERCEL);
const isPostgres = hasDatabaseUrl;

console.log(`[DB] Environment: ${process.env.NODE_ENV}`);
console.log(`[DB] Using ${isPostgres ? 'PostgreSQL' : 'SQLite'}`);
console.log('[DB] Runtime patch: pg dialect module enabled');

if (!hasDatabaseUrl && isVercelRuntime) {
    throw new Error('[DB] DATABASE_URL is required on Vercel. Set it in Project Settings -> Environment Variables.');
}

const sequelize = isPostgres
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        // Force static dependency so Vercel bundles pg for serverless runtime.
        dialectModule: pg,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false
    })
    : (() => {
        const configuredStorage = process.env.DB_STORAGE || 'aothunxuxu.db';
        const storagePath = configuredStorage === ':memory:' || path.isAbsolute(configuredStorage)
            ? configuredStorage
            : path.join(__dirname, '..', '..', configuredStorage);

        console.log(`[DB] SQLite storage path: ${storagePath}`);

        return new Sequelize({
            dialect: 'sqlite',
            storage: storagePath,
            logging: false
        });
    })();

module.exports = sequelize;
