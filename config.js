var socket;
var id;

// KEY PRESSES
KEY = {
    FORWARD: 87, // w
    LEFT: 65, // a
    BACK: 83, // s
    RIGHT: 68, // d
    LIFT: 32, // spacebar
    DROP: 16 // shift
};

var keys = {};
keys[KEY.FORWARD] = false;
keys[KEY.BACK] = false;
keys[KEY.LEFT] = false;
keys[KEY.RIGHT] = false;
keys[KEY.LIFT] = false;
keys[KEY.DROP] = false;
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
    exports.PLAYER_RADIUS = 100;
    exports.PLAYER_SEG_X = 8;
    exports.PLAYER_SEG_Y = 8;
    exports.PLAYER_VELOCITY = 15;
    exports.PLAYER_LIFT_VELOCITY = 5;
    exports.PLAYER_DROP_VELOCITY = 10;

    // plane rolling
    exports.ROLL_VELOCITY = Math.PI/360;
    exports.ROLL_LIMIT = Math.PI/9;
    exports.MOUSE_ROLL_THRESHOLD = 10;

    //plane pitching
    exports.PITCH_VELOCITY = Math.PI/360;
    exports.PITCH_LIMIT = Math.PI/18;

    exports.BULLET_LIFE = 100;
    exports.BULLET_RADIUS = 5;
    exports.BULLET_VELOCITY = 200;
    exports.BULLET_SEG_X = 3; // segments in sphere
    exports.BULLET_SEG_Y = 4;

    exports.COLLISION_STEP = 1;

    exports.GRAVITY = 6;
    exports.ENV_SIZE = 30000;
    exports.MOUSE_MOVE_RATIO = 0.004; // how much mouse moves vs how much yaw

}) (typeof exports === 'undefined' ? this['CONFIG'] = {}: exports);
