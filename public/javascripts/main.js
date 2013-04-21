$(document).ready(function() {
    socket = io.connect();

    var id;
    var entry_coordinates = {x:-1, y:-1};

    game = new Game();
    game.init();
    init_stats();
    init_world();
    init_client();

    // THREEX utilities init
    THREEx.WindowResize(WORLD.renderer, WORLD.camera);

    // Keybindings
    /*
     * emitted data: {"id":id, "pos":[x,y,z]}
     */
    $(document)
    .keydown(function(e) {
        var k;
        e.preventDefault();

        k = (e.keyCode ? e.keyCode : e.which);
        if (keys[k] !== true) {
            var dir;
            keys[k] = true;

            // id: player_id
            // dir: direction player is facing
            dir = get_my_direction();
            pos = {"x": WORLD.player.mesh.position.x,
                   "y": WORLD.player.mesh.position.y,
                   "z": WORLD.player.mesh.position.z};
            socket.emit('keydown', {"id": id, "pos": pos, "dir": dir});
        }
    })
    .keyup(function(e) {
        var k;
        e.preventDefault();
        k = (e.keyCode ? e.keyCode : e.which);
        if (k in keys) {
            keys[k] = false;

            /*
            socket.emit('keydown', {"id": id,
                                     "pos": [WORLD.player.mesh.position.x,
                                             WORLD.player.mesh.position.y,
                                             WORLD.player.mesh.position.z]});
                                             */
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
        if (ASSERT.geometry_loaded === 0) {console.log("failed to load geometry")};
        for (var p in server_entities) {
            game.entities.push(
                new Player(game,
                           p,
                           new THREE.Mesh(WORLD.player_geometry,
                                          WORLD.player_material),
                           new THREE.Vector3(0,0,0),
                           true));

            game.entities[p].mesh.position.x = server_entities[p].pos.x;
            game.entities[p].mesh.position.z = server_entities[p].pos.z;
            game.entities[p].mesh.castShadow = true;
            game.entities[p].mesh.receiveShadow = true;
            WORLD.scene.add(game.entities[p].mesh);
        }
        WORLD.player = game.entities[game.entities.length-1];
        WORLD.player.mesh.add(WORLD.camera);
    });

    socket.on('addPlayer', function(new_id) {
        game.entities.push(new Player(game, new_id,
                           new THREE.Mesh(WORLD.player_geometry,
                                          WORLD.player_material),
                           new THREE.Vector3(0,0,0),
                           true));

        game.entities[game.entities.length-1].mesh.castShadow = true;
        game.entities[game.entities.length-1].mesh.receiveShadow = true;

        WORLD.scene.add(game.entities[game.entities.length-1].mesh);
    });

    socket.on('disconnect', function() {
        //alert('Damn, connection broken.' + id);
        socket.emit('playerDisconnect', {"id": id});
    });

    /*
     * data: {"id":id, "dir":[x,y,z]}
     */
    socket.on('updatePlayer', function(data) {
        var their_id = data.id;

        // TODO: THIS IS WHERE THE PROBLEM LIES
        game.entities[their_id].mesh.position.x = data.pos.x;
        game.entities[their_id].mesh.position.y = data.pos.y;
        game.entities[their_id].mesh.position.z = data.pos.z;

        /*
        game.entities[id].dir.x = data.dir[0];
        game.entities[id].dir.y = data.dir[1];
        game.entities[id].dir.z = data.dir[2];
        */
    });
});
