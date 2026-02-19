const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('PORT_TEST_OK\n');
});
server.listen(3000, '127.0.0.1', () => {
    console.log('Test server running at http://127.0.0.1:3000/');
});
setTimeout(() => { process.exit(0); }, 5000);
