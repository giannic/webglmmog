/**
 * Global Constants
 */

var current_id = 0; //  last assigned id
var entities = [];
var bullets = [];
var PLAYER_STRUCT = {"id": 0,
                     "pos":{"x": 0, "y": 0, "z": 0},
                     "dir":{"x": 0, "y": 0, "z": 0}};

/*
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
  //, three = require('three');

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
    //app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, '/')));

    //added
    app.set('log level', 0);
    app.set('authorization', function (handshakeData, callback) {
        callback(null, true); // error first callback style
    });
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

io.sockets.on('connection', function (client) {
    // set up just connected player
    client.on('client_complete', function() {
        current_id = entities.length;
        entities.push(PLAYER_STRUCT);
        entities[entities.length-1].id = current_id;

        client.emit('assignID', current_id);

        // need to poll all current locations of players
        client.emit('setupPlayers', entities);
        client.broadcast.emit('addPlayer', current_id);
        client.emit('setupComplete'); // used to ensure mesh arent null
    });

    // data: {"id":id, "dir":[x,y,z]}
    client.on('keydown', function (player_data) {
        var player = entities[player_data.id];

        player.pos.x = player_data.pos.x;
        player.pos.y = player_data.pos.y;
        player.pos.z = player_data.pos.z;

        player.dir.x = player_data.dir.x;
        player.dir.y = player_data.dir.y;
        player.dir.z = player_data.dir.z;

        client.broadcast.emit('updatePlayer', player_data);
    });

    client.on('mousemove', function (data) {
        client.broadcast.emit('updatePlayerRotation', data);
    });
});
