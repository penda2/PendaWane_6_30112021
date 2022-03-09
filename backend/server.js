//code du server créé avec gestion du port et des erreurs
// ( un serveur écoute des requêtes http pour y répondre)
const http = require('http'); // import du package HTTP de Node pour créer un serveur 
const app = require('./app');

const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

//port 3000 utilisé par défaut; sinon on utilisera le port envoyé par l'environnement sur lequel tourne le serveur
const port = normalizePort(process.env.PORT || '3000'); // renvoie d'un port valide
app.set('port', port);

const errorHandler = error => {  // recherche et gestion des erreurs eventuelles 
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
