var socket = io.connect('http://localhost:3000');
var WORLD = {
    stats:0,
    game:0,
    renderer:0, scene:0, camera:0,
    plane_material:0, plane_geometry:0, plane_mesh:0,
    player_material:0, player_geometry:0, player_mesh:0
};

// CONSTANTS
var velocity = 0,
    JUMP_VELOCITY = 100,
    GRAVITY = 6,
    DIRECTION = {
        LEFT: 97,
        FORWARD: 119,
        RIGHT: 100,
        BACK: 115,
        JUMP: 32
    };
