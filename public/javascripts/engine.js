/*
 * Credit to:
 * Google IO 2011
 * Super Browser 2 Turbo HD Remix: Intro to HTML5 Game Dev
 * By: Seth Ladd
 */

/*
 * ENTITIES FORMAT
 * [{"id":id, "pos":[x,y,z], "active":(0 or 1)}]
 */

function GameEngine() {
    this.entities = [];
    this.bullets = [];
    this.timer = new Timer();
}

GameEngine.prototype.init = function() {
    WORLD.renderer = new THREE.WebGLRenderer({antialias: true});
    WORLD.renderer.setSize(window.innerWidth, window.innerHeight);
    WORLD.renderer.clear();
    WORLD.renderer.shadowMapEnabled = true;
    WORLD.renderer.setClearColorHex(0xEEEEEE, 1.0);
    document.body.appendChild(WORLD.renderer.domElement);
}

GameEngine.prototype.start = function() {
    this.lasteUpdate = Date.now();
    var that = this;
    (function animate() {
        that.clockTick = that.timer.tick();
        that.update();
        that.draw();
        that.click = null;
        requestAnimationFrame(animate);
    })();
}

GameEngine.prototype.draw = function(callback) {
    WORLD.renderer.render(WORLD.scene, WORLD.camera);
}

GameEngine.prototype.update = function() {
    if (keys[KEY.FORWARD]) {
        WORLD.player.mesh.translateZ(-MOVE_VELOCITY);
    }

    if (keys[KEY.BACK]) {
        WORLD.player.mesh.translateZ(MOVE_VELOCITY);
    }

    if (keys[KEY.LEFT]) {
        WORLD.player.mesh.translateX(-MOVE_VELOCITY);
    }

    if (keys[KEY.RIGHT]) {
        WORLD.player.mesh.translateX(MOVE_VELOCITY);
    }

    if (keys[KEY.JUMP]) {
        velocity = JUMP_VELOCITY;
    }

    WORLD.player.mesh.position.y += velocity;

    if (WORLD.player.mesh.position.y > 0) {
        velocity -= GRAVITY;
    } else if (WORLD.player.mesh.position.y <= 0) {
        WORLD.player.mesh.position.y = 0;
        velocity = 0;
    }

    WORLD.stats.update();
}

GameEngine.prototype.addEntity = function(entity) {

}
