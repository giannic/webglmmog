$(document).ready(function() {
    socket = io.connect();

    //var id;
    var entry_coordinates = {x:-1, y:-1};

    game = new Game();
    game.init();
    init_stats();
    init_world();
    init_client();

    // THREEX utilities init
    THREEx.WindowResize(WORLD.renderer, WORLD.camera);

    /*******************
     * ACTION BINDINGS *
     *******************/
    // When quitting the game, send this player id to the server
    window.onbeforeunload = function() {
        socket.emit('hello', {"id": id}); // disconnect signal
    };

    $(document)
    .keydown(function(e) {
        e.preventDefault();
        var k;
        k = (e.keyCode ? e.keyCode : e.which);

        keys[k] = true;
    })
    .keyup(function(e) {
        e.preventDefault();
        var k;
        k = (e.keyCode ? e.keyCode : e.which);
        if (k in keys) {
            keys[k] = false;
        }
    })
    .click(function(e) {
        emit_attack();
    });


    /****************
     * POINTER LOCK *
     ****************/
    $("#pointerLock").click(function() {
        var canvas = $("#pointerLock").get()[0];

        canvas.requestPointerLock = canvas.requestPointerLock ||
                                    canvas.mozRequestPointerLock ||
                                    canvas.webkitRequestPointerLock;

        canvas.requestPointerLock();
    });

    function changeCallback(e) {
        var canvas = $("#pointerLock").get()[0];
        if (document.pointerLockElement === canvas ||
            document.mozPointerLockElement === canvas ||
            document.webkitPointerLockElement === canvas) {
            document.addEventListener("mousemove", moveCallback, false);
        } else {
            document.removeEventListener("mousemove", moveCallback, false);
        }
    }

    function moveCallback(e) {
        move_x = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
        move_y = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
        //socket.emit("mousemove", {"id": id, "move_x": move_x});
    }

    document.addEventListener('pointerlockchange', changeCallback, false);
    document.addEventListener('mozpointerlockchange', changeCallback, false);
    document.addEventListener('webkitpointerlockchange', changeCallback, false);


    /***********
     * SIGNALS *
     ***********/
    socket.on('setupComplete', function(assigned_id) {
        game.start();
    });

    socket.on('assignID', function(assigned_id) {
        id = assigned_id;
    });

    /*
     * Loads all the connected players from the central server
     */
    socket.on('setupPlayers', function(server_entities) {
        for (var p in server_entities) {
            game.entities.push(
                new TYPE.Player(game,
                           p,
                           new THREE.Mesh(WORLD.player_geometry,
                                          WORLD.player_material),
                           new THREE.Vector3(0,0,0), // direction
                           0, // velocity
                           server_entities[p].active));

            //game.entities[p].mesh.position.x = server_entities[p].pos.x;
            //game.entities[p].mesh.position.z = server_entities[p].pos.z;
            game.entities[p].mesh.position.x = server_entities[p].mesh.position.x;
            game.entities[p].mesh.position.z = server_entities[p].mesh.position.z;
            game.entities[p].mesh.rotation.y = server_entities[p].mesh.rotation.y;
            game.entities[p].mesh.castShadow = true;
            game.entities[p].mesh.receiveShadow = true;
            WORLD.scene.add(game.entities[p].mesh);
        }
        WORLD.player = game.entities[game.entities.length-1];
        WORLD.player.mesh.add(WORLD.camera);
    });

    socket.on('addPlayer', function(new_id) {
        game.entities.push(new TYPE.Player(game, new_id,
                           new THREE.Mesh(WORLD.player_geometry,
                                          WORLD.player_material),
                           new THREE.Vector3(0,0,0), // direction
                           0, // velocity
                           true));

        game.entities[game.entities.length-1].mesh.castShadow = true;
        game.entities[game.entities.length-1].mesh.receiveShadow = true;

        WORLD.scene.add(game.entities[game.entities.length-1].mesh);
    });

    /*
     * Signal when ANOTHER players disconnects
     */
    socket.on('player_disconnect', function(id) {
        game.entities[id].active = false;
        WORLD.scene.remove(game.entities[id].mesh);
        //alert(id);
    });


    /**************************
     * Updating OTHER Players *
     **************************/
    socket.on('updatePlayer', function(data) {
        //var their_id = data.id;
        game.entities_updates.push(data);
    });

    // this should probably be pushed to entities_updates
    // instead of being updated here
    socket.on('updatePlayerRotation', function(data) {
        //game.entities[data.id].mesh.rotation.y -= data.move_x * CONFIG.MOUSE_MOVE_RATIO;
    });


    // new bullet from another player
    socket.on('new_bullet', function(bullet_data) {
        game.bullets.push(new TYPE.Bullet(game,
                                          new THREE.Vector3(bullet_data.dir.x,
                                                            bullet_data.dir.y,
                                                            bullet_data.dir.z),
                                          new THREE.Mesh(WORLD.bullet_geometry,
                                                         WORLD.bullet_material))
                         );

        game.bullets[game.bullets.length-1].mesh.position = bullet_data.pos;
        WORLD.scene.add(game.bullets[game.bullets.length-1].mesh);
    });
});
