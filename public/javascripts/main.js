$(document).ready(function() {
    var id;
    var light;

    game = new Game();
    game.init();
    init_stats();
    init_world();
    init_client();

    // THREEX utilities init
    THREEx.WindowResize(WORLD.renderer, WORLD.camera);

    $(document).keypress(function(e) {
        e.preventDefault();

        var k;
            //direction,
            //r_axis, r_angle, r_matrix;

        k = (e.keyCode ? e.keyCode : e.which)

        if (k === DIRECTION.FORWARD) {
            WORLD.player_mesh.translateZ(-MOVE_VELOCITY);
        } else if (k === DIRECTION.BACK) {
            WORLD.player_mesh.translateZ(MOVE_VELOCITY);
        } else if (k === DIRECTION.LEFT) {
            WORLD.player_mesh.translateX(-MOVE_VELOCITY);
        } else if (k === DIRECTION.RIGHT) {
            WORLD.player_mesh.translateX(MOVE_VELOCITY);
        } else if (k === DIRECTION.JUMP) {
            velocity = JUMP_VELOCITY;
        }

        socket.emit('keypress', [id, k]); // tell the server I am moving
    });

    //$(document).mousemove(function(e) { // this is different?
    document.addEventListener("mousemove", function (e) {
        var moveX, moveY;
        var theta = Math.PI/360.0;

        moveX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
        moveY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

        WORLD.player_mesh.rotation.y -= moveX*0.01;
        //WORLD.player_mesh.rotation.x -= moveY*0.01;
        //WORLD.camera.lookAt(WORLD.player_mesh.position);
    });

    /*
    $(window).keydown(function(event) {
        socket.emit('playerUpdate', {player: me, direction: event.keyCode});
    });
    */
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
            game.entities.push(new THREE.Mesh(WORLD.player_geometry, WORLD.player_material));
            game.entities[game.entities.length-1].position.x = server_entities[p][0];
            game.entities[game.entities.length-1].position.z = server_entities[p][1];
            game.entities[game.entities.length-1].castShadow = true;
            game.entities[game.entities.length-1].receiveShadow = true;
            WORLD.scene.add(game.entities[game.entities.length-1]);
        }
        WORLD.player_mesh = game.entities[game.entities.length-1];
        WORLD.player_mesh.add(WORLD.camera);
    });

    socket.on('addPlayer', function(data) {
        game.entities.push(new THREE.Mesh(WORLD.player_geometry, WORLD.player_material));
        game.entities[game.entities.length-1].castShadow = true;
        game.entities[game.entities.length-1].receiveShadow = true;

        WORLD.scene.add(game.entities[game.entities.length-1]);
    });

    /*
    socket.on('disconnect', function() {
        alert('Damn, connection broken.');
        socket.emit('playerDisconnect', {id: me});
    });
    */

    socket.on('updatePlayer', function(data) {
        var player_id = data[0],
            k = data[1];
        if (k === DIRECTION.FORWARD) {
            game.entities[player_id].position.z -= 50;
        } else if (k === DIRECTION.BACK) {
            game.entities[player_id].position.z += 50;
        } else if (k === DIRECTION.LEFT) {
            game.entities[player_id].position.x -= 50;
        } else if (k === DIRECTION.RIGHT) {
            game.entities[player_id].position.x += 50;
        } else if (k === DIRECTION.JUMP) {
            //velocity = JUMP_VELOCITY;
        }
    });
});
