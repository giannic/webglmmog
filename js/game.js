function Game() {
    GameEngine.call(this);
}

Game.prototype = new GameEngine();
Game.prototype.constructor = Game;

Game.prototype.start = function() {
    this.me = null;
    GameEngine.prototype.start.call(this);
}

Game.prototype.update = function() {
    GameEngine.prototype.update.call(this);
}

Game.prototype.draw = function() {
    GameEngine.prototype.draw.call(this);
}
