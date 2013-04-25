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

io.set('log level', 1);

var routes = require('./routes')
  , user = require('./routes/user')
  , path = require('path')
  , fs = require('fs')
  , THREE = require('three');

// my own utilities
var TYPE = require('./entities.js')
  , CONFIG = require('./config.js')
  , WORLD = require('./world.js')
  , CORE = require('./core.js');

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

/************************************
 * setup on server side to be ready *
 ************************************/
WORLD.player_mesh = CORE.init_player_mesh(); // represented by cube here
WORLD.player_material = CORE.init_player_material();



io.sockets.on('connection', function (client) {
    // set up just connected player
    client.on('client_complete', function() {
        new_player();

        setup_players();

        // need to poll all current locations of players
        client.broadcast.emit('addPlayer', current_id);
        client.emit('setupComplete'); // used to ensure mesh arent null
    });

    // data: {"id":id, "dir":[x,y,z]}
    client.on('keydown', function (player_data) {
        var player = entities[player_data.id];
        update_player(player, player_data);
        client.broadcast.emit('updatePlayer', player_data);
    });

    client.on('new_bullet', function(bullet_data) {
        client.broadcast.emit('new_bullet', bullet_data);
    });

    //client.on('mousemove', function (data) {
        //client.broadcast.emit('updatePlayerRotation', data);
    //});


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

    function setup_players() {
        client.emit('setupPlayers', entities);
    }

    // no rolling for now
    function update_player(player, data) {
        if (player === undefined || data === undefined) return;

        var player_roll;

        player_roll = player.mesh.rotation.z;

        if (data.keys[KEY.FORWARD]) {
            player.mesh.translateZ(-CONFIG.PLAYER_VELOCITY);
        }

        if (data.keys[KEY.BACK]) {
            player.mesh.translateZ(CONFIG.PLAYER_VELOCITY);
        }

        if (data.keys[KEY.LEFT]) {
            //player.mesh.rotation.z = 0;

            player.mesh.translateX(-CONFIG.PLAYER_VELOCITY);

            /*
            player.mesh.rotation.z = player_roll;
            if (player_roll < CONFIG.ROLL_LIMIT) {
                player.mesh.rotation.z += CONFIG.ROLL_VELOCITY; // ROLL
            }
            */
        }/* else if (player_roll > 0) {
            // rolled, but released key
            //player.mesh.rotation.z -= CONFIG.ROLL_VELOCITY; // ROLL BACK
        }*/

        if (data.keys[KEY.RIGHT]) {
            //player.mesh.rotation.z = 0;

            player.mesh.translateX(CONFIG.PLAYER_VELOCITY);

            /*
            player.mesh.rotation.z = player_roll;
            if (player_roll > -CONFIG.ROLL_LIMIT) {
                player.mesh.rotation.z -= CONFIG.ROLL_VELOCITY; // ROLL
            }
            */
        }/* else if (player_roll < 0) {
            // rolled, but released key
            //player.mesh.rotation.z += CONFIG.ROLL_VELOCITY; // ROLL BACK
        }*/

        //if (keys[KEY.LIFT] && player_pitch < CONFIG.PITCH_LIMIT) {
        if (data.keys[KEY.LIFT]) {
            player.mesh.translateY(CONFIG.PLAYER_LIFT_VELOCITY);

            //var rotm = new THREE.Matrix4();
            /*
            WORLD.player.mesh.matrix.multiply(rotm);
            WORLD.player.mesh.rotation.setEulerFromRotationMatrix(WORLD.player.mesh.matrix, WORLD.player.mesh.order);
            */

            //WORLD.player.mesh.rotateX(CONFIG.PITCH_VELOCITY);
            //WORLD.player.mesh.rotation.x += CONFIG.PITCH_VELOCITY; // ROLL BACK
        } /*else if (player_pitch > 0) {
        }
        */

        if (data.move_x) {
            player.mesh.rotation.y -= data.move_x*CONFIG.MOUSE_MOVE_RATIO;

            // If mouse moves enough, plane will also roll
            if (data.move_x > CONFIG.MOUSE_ROLL_THRESHOLD &&
                player.mesh.rotation.z > -CONFIG.ROLL_LIMIT) { // right
                player.mesh.rotation.z -= CONFIG.ROLL_VELOCITY;
            } else if (data.move_x < -CONFIG.MOUSE_ROLL_THRESHOLD &&
                       player.mesh.rotation.z > -CONFIG.ROLL_LIMIT) { // left
                player.mesh.rotation.z += CONFIG.ROLL_VELOCITY;
            } else {
            }
            //move_x = 0; // reset for next frame
        }
    }
});
