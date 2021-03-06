/***************
 * Server File *
 ***************/
/*
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

io.set('log level', 0);

var routes = require('./routes')
  , user = require('./routes/user')
  , path = require('path')
  , fs = require('fs')
  , THREE = require('three');

/*
 * Game dependencies
 */
var TYPE = require('./entities.js')
  , CONFIG = require('./config.js')
  , WORLD = require('./world.js')
  , CORE = require('./core.js');


/*
 * Server configuration
 */
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


/*
 * Main Server setup (to be ready for clients)
 */
WORLD.player_mesh = CORE.init_player_mesh(); // represented by cube here
WORLD.player_material = CORE.init_player_material();

io.sockets.on('connection', function (client) {

    // Receive client complete setup status
    client.on('client_complete', function() {
        new_player();

        setup_players();

        // need to poll all current locations of players
        client.broadcast.emit('addPlayer', current_id);
        client.emit('setupComplete'); // used to ensure mesh arent null
    });

    // Receive client keypress
    client.on('keydown', function (player_data) {
        var player = entities[player_data.id];
        update_player(player, player_data);
        client.broadcast.emit('updatePlayer', player_data);
    });

    // Receive client mouse click
    client.on('new_bullet', function(bullet_data) {
        client.broadcast.emit('new_bullet', bullet_data);
    });

    // Receive client hit state
    client.on('hit', function(hit_player_data) {
        client.broadcast.emit('hit', hit_player_data);
    });

    /*
     * Receive client disconnect
     */
    client.on('hello', function(player_data) {
        var id = player_data.id;
        console.log("===================================================");
        console.log("Disconnected ID: " + id);
        client.broadcast.emit('player_disconnect', player_data.id);
        if (entities[id] !== undefined) {
            entities[id].active = false;
        }
    });

    /*
     * Helper functions to sync server and client
     */
    function new_player() {
        current_id = entities.length;
        var player_to_add = new TYPE.Player(0, // game, server doesn't need
                                   current_id,
                                   new THREE.Mesh(WORLD.player_mesh,
                                                  WORLD.player_material),
                                   new THREE.Vector3(0, 0, 0),
                                   0,
                                   true);

        entities.push(player_to_add);

        entities[entities.length-1].id = current_id;
        client.emit('assignID', current_id);
    }

    /*
     * Prompts client to setup the states of other clients
     */
    function setup_players() {
        client.emit('setupPlayers', entities);
    }

    /*
     * Updates the player location on the server
     */
    function update_player(player, data) {
        if (player === undefined || data === undefined) return;
        if (player.active === false) return;

        var player_roll;
        player_roll = player.mesh.rotation.z;

        if (data.keys[KEY.FORWARD]) {
            player.mesh.translateZ(-CONFIG.PLAYER_VELOCITY);
        }

        if (data.keys[KEY.BACK]) {
            player.mesh.translateZ(CONFIG.PLAYER_VELOCITY);
        }

        if (data.keys[KEY.LEFT]) {
            player.mesh.translateX(-CONFIG.PLAYER_VELOCITY);
        }

        if (data.keys[KEY.RIGHT]) {
            player.mesh.translateX(CONFIG.PLAYER_VELOCITY);
        }

        if (data.keys[KEY.LIFT]) {
            player.mesh.translateY(CONFIG.PLAYER_LIFT_VELOCITY);
        }

        if (data.keys[KEY.DROP]) {
            player.mesh.translateY(-CONFIG.PLAYER_DROP_VELOCITY);
        }

        if (data.move_x) {
            player.mesh.rotation.y -= data.move_x*CONFIG.MOUSE_MOVE_RATIO;
        }
    }
});
