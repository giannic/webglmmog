// PATHS
var OBJ_PATH = "../obj/",
    IMG_PATH = "../images/";

var WORLD = {
    stats:0,
    game:0,
    player:0,
    renderer:0, scene:0, camera:0,
    plane_material:0, plane_geometry:0, plane_mesh:0,
    player_material:0, player_geometry:0, player_mesh:0,
    bullet_material:0, bullet_geometry:0, bullet_mesh:0,
    light:0
};

// CONSTANTS
var PLAYER_RADIUS = 20,
    PLAYER_SEG_X = 8,
    PLAYER_SEG_Y = 8,

    BULLET_LIFE = 100,
    BULLET_RADIUS = 5,
    BULLET_VELOCITY = 20,
    BULLET_SEG_X = 5,
    BULLET_SEG_Y = 5,

    velocity = 0,
    JUMP_VELOCITY = 50,
    MOVE_VELOCITY = 15,
    GRAVITY = 6,
    ENV_SIZE = 20000,

    KEY = {
        LEFT: 65,
        FORWARD: 87,
        RIGHT: 68,
        BACK: 83,
        JUMP: 32
    };


// KEY PRESSES
var keys = {};
keys[KEY.FORWARD] = false;
keys[KEY.BACK] = false;
keys[KEY.LEFT] = false;
keys[KEY.RIGHT] = false;
keys[KEY.JUMP] = false;
keys[KEY.ATTACK] = false;

// MOUSE MOVE
var move_x, move_y;
