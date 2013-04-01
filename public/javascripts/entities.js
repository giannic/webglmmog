/*
 * Credit to:
 *      Google IO 2011
 *      Super Browser 2 Turbo HD Remix: Intro to HTML5 Game Dev
 *      By: Seth Ladd
 */

/*
 * Entity
 */
function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.update = function() {

}

Entity.prototype.draw = function() {
}

/*
 * Player
 */
function Player() {}
function Player(game, id, x, y, active) {
    Entity.call(this, game, x, y);
    this.id = id;
    this.active = active;
}

Player.prototype = new Entity();
Player.prototype.constructor = Player;

Player.prototype.update = function() {
    Entity.prototype.update.call(this);
}

Player.prototype.draw = function(ctx) {
    Entity.prototype.draw.call(this, ctx);
}

/*
 * Bullet
 */
function Bulllet() {}
function Bullet(game, velocity, mesh) {
    Entity.call(this, game);
    this.v = velocity;
    this.mesh = mesh;
}

Bullet.prototype = new Entity();
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function() {
    Entity.prototype.update.call(this);
}

Bullet.prototype.draw = function(ctx) {
    Entity.prototype.draw.call(this, ctx);
}
