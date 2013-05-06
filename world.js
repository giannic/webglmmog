/**************
 * WORLD VARS *
 **************/
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
