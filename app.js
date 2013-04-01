/**
 * Global Constants
 */

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

    // data: {"id":id, "pos":[x,y,z]}
    socket.on('keypress', function (data) {
        //var player = entities[data[0]];
        var player = entities[data.id];

        player[0] = data.pos[0];
        player[1] = data.pos[1];
        player[2] = data.pos[2];

        socket.broadcast.emit('updatePlayer', data);
    });
});
