(function(exports){

exports.hello = function() {
    console.log('hello');
};

exports.Entity = function(game, mesh) {
    this.game = game;
    this.mesh = mesh;
    this.removeFromWorld = false;
}

/*
 * Entity
 */
exports.Entity = function(game, mesh) {
    this.game = game;
    this.mesh = mesh;
    this.removeFromWorld = false;
}

exports.Entity.prototype.update = function() {}

exports.Entity.prototype.draw = function() {}

/*
 * Player
 */
//function Player() {}
exports.Player = function(game, id, mesh, dir, velocity, active) {
    exports.Entity.call(this, game, mesh);
    this.id = id;
    this.dir = dir;
    this.velocity = velocity;
    this.active = active;
}

exports.Player.prototype = new exports.Entity();
exports.Player.prototype.constructor = exports.Player;

exports.Player.prototype.update = function() {
    Entity.prototype.update.call(this);
}

exports.Player.prototype.draw = function(ctx) {
    Entity.prototype.draw.call(this, ctx);
}

/*
 * Bullet
 */
//function Bulllet() {}
exports.Bullet = function(game, velocity, mesh) {
    exports.Entity.call(this, game, mesh);
    this.velocity = velocity;
    this.mesh = mesh;
    this.life = BULLET_LIFE;
}

exports.Bullet.prototype = new exports.Entity();
exports.Bullet.prototype.constructor = exports.Bullet;

exports.Bullet.prototype.update = function() {
    Entity.prototype.update.call(this);
}

exports.Bullet.prototype.draw = function(ctx) {
    Entity.prototype.draw.call(this, ctx);
}

}) (typeof exports === 'undefined' ? this['TYPE'] = {}: exports);
