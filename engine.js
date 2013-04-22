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


/***********
 * UPDATES *
 ***********/

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
    var player_roll;

    player_roll = WORLD.player.mesh.rotation.z;

    if (keys[KEY.FORWARD]) {
        WORLD.player.mesh.translateZ(-CONFIG.PLAYER_VELOCITY);
    }

    if (keys[KEY.BACK]) {
        WORLD.player.mesh.translateZ(CONFIG.PLAYER_VELOCITY);
    }

    if (keys[KEY.LEFT]) {
        WORLD.player.mesh.translateX(-CONFIG.PLAYER_VELOCITY);
        if (player_roll < CONFIG.ROLL_LIMIT) {
            WORLD.player.mesh.rotation.z += CONFIG.ROLL_VELOCITY; // ROLL
        }
    } else if (player_roll > 0 && move_x > -CONFIG.MOUSE_ROLL_THRESHOLD) {
        // rolled, but released key
        WORLD.player.mesh.rotation.z -= CONFIG.ROLL_VELOCITY; // ROLL BACK
    }

    if (keys[KEY.RIGHT]) {
        WORLD.player.mesh.translateX(CONFIG.PLAYER_VELOCITY);
        if (player_roll > -CONFIG.ROLL_LIMIT) {
            WORLD.player.mesh.rotation.z -= CONFIG.ROLL_VELOCITY; // ROLL
        }
    } else if (player_roll < 0 && move_x < CONFIG.MOUSE_ROLL_THRESHOLD) {
        // rolled, but released key
        WORLD.player.mesh.rotation.z += CONFIG.ROLL_VELOCITY; // ROLL BACK
    }

    /*
    WORLD.player.mesh.position.y += velocity;

    if (WORLD.player.mesh.position.y > 0) {
        velocity -= GRAVITY;
    } else if (WORLD.player.mesh.position.y <= 0) {
        WORLD.player.mesh.position.y = 0;
        velocity = 0;
    }
    */

    if (move_x) {
        WORLD.player.mesh.rotation.y -= move_x*CONFIG.MOUSE_MOVE_RATIO;

        // If mouse moves enough, plane will also roll
        if (move_x > CONFIG.MOUSE_ROLL_THRESHOLD &&
            WORLD.player.mesh.rotation.z > -CONFIG.ROLL_LIMIT) { // rightward
            WORLD.player.mesh.rotation.z -= CONFIG.ROLL_VELOCITY;
        } else if (move_x < -CONFIG.MOUSE_ROLL_THRESHOLD &&
                   WORLD.player.mesh.rotation.z > -CONFIG.ROLL_LIMIT) { // leftward
            WORLD.player.mesh.rotation.z += CONFIG.ROLL_VELOCITY;
        } else {
        }

        move_x = 0; // reset for next frame
    }

    // clear active keys on each update frame
    /*
    for (var k in keys) {
        keys[k] = false;
    }
    */
}

/*
 * Updates for other players
 * But, this is essentially the same as update myself for now
 * Maybe should merge, and take in the player to update instead
 */
GameEngine.prototype.updatePlayers = function() {
    $.each(this.entities_updates, function(idx, update) {
        if (update.keys[KEY.FORWARD]) {
            game.entities[update.id].mesh.translateZ(-CONFIG.PLAYER_VELOCITY);
        }

        if (update.keys[KEY.BACK]) {
            game.entities[update.id].mesh.translateZ(CONFIG.PLAYER_VELOCITY);
        }

        if (update.keys[KEY.LEFT]) {
            game.entities[update.id].mesh.translateX(-CONFIG.PLAYER_VELOCITY);
        }

        if (update.keys[KEY.RIGHT]) {
            game.entities[update.id].mesh.translateX(CONFIG.PLAYER_VELOCITY);
        }
    });
    this.entities_updates.length = 0; // clear updates for this frame
}

GameEngine.prototype.updateBullets = function() {
    for (var b in this.bullets) {
        this.bullets[b].life -= 1;
        if (this.bullets[b].life > 0) {
            this.bullets[b].mesh.position.x += this.bullets[b].velocity.x;
            this.bullets[b].mesh.position.z += this.bullets[b].velocity.z;
            //this.bullets[b].mesh.position.y += this.bullets[b].velocity.y;
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
                diff.length() < CONFIG.PLAYER_RADIUS + CONFIG.BULLET_RADIUS) {
                // for now, set hit to red
                this.entities[p].mesh.material = WORLD.player_material_hit;
            }
        }
    }
}

GameEngine.prototype.addEntity = function(entity) {

}
