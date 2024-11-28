const express = require('express');
const path = require('path');
const SignatureVerifier = require('./signatureVerifier');
const verifyMiddleware = require('./verifyMiddleware');

class Server {
  constructor(port) {
    this.app = express();
    this.port = port;
    this.verifier = new SignatureVerifier(process.env.PUBLIC_KEY_PATH || 'public.pem');
    this.middlewares();
    this.routes();
  }

  // Called everytime a request is made 
  middlewares() {
    this.app.use(express.json());
    this.app.use(verifyMiddleware(this.verifier));
  }

  routes() {
    const routes = [
      '/',
      '/login',
      '/dashboard',
      '/reset',
      '/forgot',
      '/register',
      '/message',
      '/detect',
      '/video',
      '/admin',
      '/favicon.ico'
    ];

    // Define express get route for each element in array 
    routes.forEach((route) => {
      this.app.get(route, (req, res) => {
        console.log('route', route)
        if (route === '/favicon.ico') {
          console.log('favicon')
          res.sendFile(
            path.join(__dirname, '../public', 'favicon.ico')
          );
        } else{
          res.sendFile(
            path.join(__dirname, '../public', `${route === '/' ? 'index' : route.substring(1)}.html`)
          );
        }
        
      });
    });
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`JWT Auth server running on port ${this.port}`);
    });
  }
}

module.exports = Server;
