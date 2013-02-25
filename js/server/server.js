var VELOCITY = 50;
var DIRECTION = {
    LEFT: 97,
    FORWARD: 119,
    RIGHT: 100,
    BACK: 115,
    JUMP: 32
};

var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs');
var current_id = 0;
var entities = [];

app.listen(80);

function handler(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
    console.log("server access");
}

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
