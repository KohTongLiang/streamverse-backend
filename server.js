#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('./app');
var debug = require('debug')('acs-node-project:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

// Websocket portion
// to be moved to a custom middleware
const WebSocket = require('ws');
var gameTracker =  {  }
const wss = new WebSocket.Server({ server: server });

wss.getUniqueID = function () {
  function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4();
};

wss.on('connection', function connection(ws, req) {
  ws.id = wss.getUniqueID();
  ws.on('message', function incoming(data) {
    let inData = JSON.parse(data.toString());

    if (inData.type === "end") {
      delete gameTracker[inData.groupId];
      console.log(`Current ongoing games: ${JSON.stringify(gameTracker)}`);
    } else {
      if (gameTracker[inData.groupId] === undefined) {
        gameTracker[inData.groupId] = [ws.id];
      } else if (!gameTracker[inData.groupId].includes(ws.id)) {
        gameTracker[inData.groupId].push(ws.id);
      }
      console.log(`Current ongoing games: ${JSON.stringify(gameTracker)}`);
      var receivers = gameTracker[inData.groupId]
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN && receivers.includes(client.id)) {
          client.send(JSON.stringify(inData.gameState));
        }
      });
    }
  });
});

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);
  console.log("Running on " + port)

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.log(port + ' this port')
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log("Server started on " + port)
}
