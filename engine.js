function GameEngine() {
    this.entities = [];
    this.bullets = [];
    this.timer = new Timer();

    this.entities_updates = [];
}

GameEngine.prototype.init = function() {
    WORLD.renderer = new THREE.WebGLRenderer({antialias: true});
    WORLD.renderer.setSize(window.innerWidth, window.innerHeight);
    WORLD.renderer.clear();
    WORLD.renderer.shadowMapEnabled = true;
    WORLD.renderer.shadowMapSoft = true;
    WORLD.renderer.setClearColor(0xEEEEEE, 1.0);
    document.body.appendChild(WORLD.renderer.domElement);
    $("canvas").attr("id", "pointerLock");
}

GameEngine.prototype.start = function() {
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
    /*
    for (var p in this.entities) {
        this.entities[p].mesh.material = WORLD.player_material;
    }
    */

    this.updateMyself();
    this.updatePlayers();
    this.updateBullets();
    this.checkCollisions();

    WORLD.stats.update();
}

GameEngine.prototype.updateMyself = function() {
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

    /*
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
    */

    if (move_x) {
        WORLD.player.mesh.rotation.y -= move_x*0.01;
        move_x = 0;
    }
}

GameEngine.prototype.updatePlayers = function() {
    $.each(this.entities_updates, function(idx, update) {
        game.entities[update.id].mesh.position.x = update.pos.x;
        game.entities[update.id].mesh.position.y = update.pos.y;
        game.entities[update.id].mesh.position.z = update.pos.z;
    });
    this.entities_updates.length = 0; // clear updates for this frame
}

GameEngine.prototype.updateBullets = function() {
    for (var b in this.bullets) {
        this.bullets[b].life -= 1;
        if (this.bullets[b].life > 0) {
            this.bullets[b].mesh.position.x += this.bullets[b].velocity.x;
            this.bullets[b].mesh.position.z += this.bullets[b].velocity.z;
            //bullets[b].mesh.position.y += bullets[b].velocity.y;
        }
    }
}

GameEngine.prototype.checkCollisions = function() {
    var diff = new THREE.Vector3();
    for (var p in this.entities) {
        for (var b in this.bullets) {
            diff.subVectors(this.entities[p].mesh.position, this.bullets[b].mesh.position); // r58
            //diff.sub(this.entities[p].mesh.position, this.bullets[b].mesh.position); // r54
            if (this.entities[p] !== WORLD.player &&
                diff.length() < PLAYER_RADIUS + BULLET_RADIUS) {
                // for now, set hit to red
                this.entities[p].mesh.material = WORLD.player_material_hit;
            }
        }
    }
}

GameEngine.prototype.addEntity = function(entity) {

}
