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
function Player(game, id, x, y) {
    Entity.call(this, game, x, y);
    this.id = id;
}
Player.prototype = new Entity();
Player.prototype.constructor = Player;

Player.prototype.update = function() {
    Entity.prototype.update.call(this);
}

Player.prototype.draw = function(ctx) {
    Entity.prototype.draw.call(this, ctx);
}
