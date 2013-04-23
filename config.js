var socket;

// KEY PRESSES
KEY = {
    FORWARD: 87, // w
    LEFT: 65, // a
    BACK: 83, // s
    RIGHT: 68, // d
    LIFT: 32 // spacebar
};

var keys = {};
keys[KEY.FORWARD] = false;
keys[KEY.BACK] = false;
keys[KEY.LEFT] = false;
keys[KEY.RIGHT] = false;
keys[KEY.LIFT] = false;
keys[KEY.ATTACK] = false;

// MOUSE MOVE
var move_x, move_y;

/**********
 * CONFIG *
 **********/
(function (exports) {
    // PATHS
    exports.OBJ_PATH = "obj/",
    exports.IMG_PATH = "images/";

    // CONSTANTS
    exports.PLAYER_RADIUS = 20;
    exports.PLAYER_SEG_X = 8;
    exports.PLAYER_SEG_Y = 8;
    exports.PLAYER_VELOCITY = 15;
    exports.PLAYER_LIFT_VELOCITY = 3;

    // plane rolling
    exports.ROLL_VELOCITY = Math.PI/360;
    exports.ROLL_LIMIT = Math.PI/18;
    exports.MOUSE_ROLL_THRESHOLD = 10;

    //plane pitching
    exports.PITCH_VELOCITY = Math.PI/360;
    exports.PITCH_LIMIT = Math.PI/18;

    exports.BULLET_LIFE = 100;
    exports.BULLET_RADIUS = 5;
    exports.BULLET_VELOCITY = 200; // AHHH need to do ray intersection!
    exports.BULLET_SEG_X = 5; // segments in sphere
    exports.BULLET_SEG_Y = 5;

    exports.GRAVITY = 6;
    exports.ENV_SIZE = 20000;
    exports.MOUSE_MOVE_RATIO = 0.01; // how much mouse moves vs how much yaw

}) (typeof exports === 'undefined' ? this['CONFIG'] = {}: exports);
