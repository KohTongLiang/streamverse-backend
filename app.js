var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
// var bodyParser = require('body-parser');
const WebSocket = require('ws');
var logger = require('morgan');

var dbClient = require('./db/index')
var dbInitializationService = require('./db/dbInitialize')

console.log('connecting to cosmosdb...')
dbClient.connect().then(() => {
  console.log("connected to the database successfully")
  // dbInitializationService.initializeDB();
}).catch((e) => {
  console.log(e)
})

// Websocket portion
// to be moved to a custom middleware
var gameTracker =  {  }
const wss = new WebSocket.Server({ port: 8080 });

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

var indexRouter = require('./routes/index');
var userProvisionRouter = require('./routes/user.routes');
var authRouter = require('./routes/auth.routes');
var chatRouter = require('./routes/chat.routes');
// var botRouter = require('./routes/bot.routes');

var app = express();

// usages
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(express.static('public'))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userProvisionRouter);
app.use('/auth', authRouter);
app.use('/chat', chatRouter);
// app.use('/bot', botRouter);

app.get('/reset', async (req, res) => {
  await dbInitializationService.initializeDB();
  res.status(200).send("<h1>Database reset completed successfully!</h1>")
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


module.exports = app;