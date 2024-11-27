require('dotenv').config();
const Server = require('./server');

const server = new Server(process.env.PORT || 8080);
server.start();
