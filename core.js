/*
 * Core Functions shared between client and server
 */

(function(exports) {
console.log("setting up core objects");

var THREE = require('three');

exports.init_player_mesh = function() {
    return new THREE.CubeGeometry(1, 1, 1);
};

exports.init_player_material = function() {
    return new THREE.MeshLambertMaterial({color: 0xEEEEEE});
};


}) (typeof exports === 'undefined' ? this['CORE'] : exports);
