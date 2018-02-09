/**
 * App - The express server
 * @module app
 */
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const app = express();
const names = require('./names.json');

app.set('http_port', 3000);
const httpServer = http.createServer(app);
httpServer.listen(3000);
httpServer.on('error', err => onError(err, 3000));
httpServer.on('listening', () => onListening(httpServer));


/**
 * Event listener for HTTP httpServer "error" event.
 */
function onError(error, port) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.log(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.log(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP httpServer "listening" event.
 */
function onListening(server) {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set global headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Add all routes
app.get('/katNames', function (req, res) {
  res.json(names)
})

// Return a 404 for anything that doesnt match our routes
app.use((req, res, next) => {
  next(new NotFoundError());
});



module.exports = app;
