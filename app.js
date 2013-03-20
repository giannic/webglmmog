/**
 * Global Constants
 */
var VELOCITY = 50;
var DIRECTION = {
    LEFT: 97,
    FORWARD: 119,
    RIGHT: 100,
    BACK: 115,
    JUMP: 32
};

var current_id = 0;
var entities = [];

/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var routes = require('./routes')
  , user = require('./routes/user')
  , path = require('path')
  , fs = require('fs');

server.listen(3000);

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

// original sockets code
io.sockets.on('connection', function (socket) {
    current_id = entities.length;
    entities.push([0, 0]);
    socket.emit('assignID', current_id);
    socket.emit('setupPlayers', entities);
    socket.emit('setupComplete'); // used to ensure mesh arent null
    socket.broadcast.emit('addPlayer', current_id);

    // data: [player_id, keycode]
    socket.on('keypress', function (data) {
        var player = entities[data[0]];
        var k = data[1]; // keycode
        if (k === DIRECTION.FORWARD) {
            player[1] -= VELOCITY;
        } else if (k === DIRECTION.BACK) {
            player[1] += VELOCITY;
        } else if (k === DIRECTION.LEFT) {
            player[0] -= VELOCITY;
        } else if (k === DIRECTION.RIGHT) {
            player[0] += VELOCITY;
        } else if (k === DIRECTION.JUMP) {
        }
        socket.broadcast.emit('updatePlayer', data);
    });

    /*
    socket.on('playerUpdate', function (data) {
        socket.broadcast.emit('playerUpdate', data);
        socket.emit('playerUpdate', data);
    });
    */
});
