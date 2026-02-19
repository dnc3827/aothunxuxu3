const fs = require('fs');
const path = require('path');
require('dotenv').config();

const results = {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL_PRESENT: !!process.env.DATABASE_URL,
    CWD: process.cwd(),
    FILES: fs.readdirSync('.')
};

fs.writeFileSync('diagnostic_results.json', JSON.stringify(results, null, 2));
console.log('DIAGNOSTIC_DONE');
