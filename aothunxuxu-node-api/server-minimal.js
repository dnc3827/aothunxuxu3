const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./src/config/database');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        console.log('MINIMAL: Starting...');
        await sequelize.authenticate();
        console.log('MINIMAL: DB OK');
        app.listen(PORT, () => console.log('MINIMAL: Server Live'));
    } catch (e) {
        console.error('MINIMAL: Fail', e);
    }
};
startServer();
