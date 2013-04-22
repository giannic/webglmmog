var socket;

// KEY PRESSES
KEY = {
    LEFT: 65,
    FORWARD: 87,
    RIGHT: 68,
    BACK: 83,
    JUMP: 32 // currently unused
};

var keys = {};
keys[KEY.FORWARD] = false;
keys[KEY.BACK] = false;
keys[KEY.LEFT] = false;
keys[KEY.RIGHT] = false;
keys[KEY.JUMP] = false;
keys[KEY.ATTACK] = false;

// MOUSE MOVE
var move_x, move_y;

/*********
 * WORLD *
 *********/
(function (exports) {
    stats = 0;
    game = 0;
    player = 0;

    renderer = 0;
    scene = 0;
    camera = 0;

    plane_material = 0;
    plane_geometry = 0;
    plane_mesh = 0;

    player_material = 0;
    player_geometry = 0;
    player_mesh = 0;

    bullet_material = 0;
    bullet_geometry = 0;
    bullet_mesh = 0;

    light = 0;

}) (typeof exports === 'undefined' ? this['WORLD'] = {}: exports);

/**********
 * CONFIG *
 **********/
(function (exports) {
    /*
var WORLD = {
    stats:0,
    game:0,
    player:0,
    renderer:0, scene:0, camera:0,
    plane_material:0, plane_geometry:0, plane_mesh:0,
    player_material:0, player_geometry:0, player_mesh:0,
    bullet_material:0, bullet_geometry:0, bullet_mesh:0,
    light:0
    */

// PATHS
exports.OBJ_PATH = "obj/",
exports.IMG_PATH = "images/";

// CONSTANTS
exports.PLAYER_RADIUS = 20;
exports.PLAYER_SEG_X = 8;
exports.PLAYER_SEG_Y = 8;
exports.PLAYER_VELOCITY = 15;

// plane rolling
exports.ROLL_VELOCITY = Math.PI/360;
exports.ROLL_LIMIT = Math.PI/18;
exports.MOUSE_ROLL_THRESHOLD = 10;

exports.BULLET_LIFE = 100;
exports.BULLET_RADIUS = 5;
exports.BULLET_VELOCITY = 20;
exports.BULLET_SEG_X = 5; // segments in sphere
exports.BULLET_SEG_Y = 5;

exports.GRAVITY = 6;
exports.ENV_SIZE = 20000;
exports.MOUSE_MOVE_RATIO = 0.01; // how much mouse moves vs how much yaw

}) (typeof exports === 'undefined' ? this['CONFIG'] = {}: exports);
