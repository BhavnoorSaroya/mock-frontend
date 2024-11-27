require('dotenv').config();
const Server = require('./modules/server');

const server = new Server(process.env.PORT || 8080);
server.start();
