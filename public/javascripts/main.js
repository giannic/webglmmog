$(document).ready(function() {
    var socket = io.connect();
    var id;

    game = new Game();
    game.init();
    init_stats();
    init_world();
    init_client();

    // THREEX utilities init
    THREEx.WindowResize(WORLD.renderer, WORLD.camera);

    /*
     * emitted data: {"id":id, "pos":[x,y,z]}
     */
    $(document).keydown(function(e) {
        var k;
        e.preventDefault();

        k = (e.keyCode ? e.keyCode : e.which);
        keys[k] = true;

       // the id and position
        socket.emit('keypress', {"id": id,
                                 "pos": [WORLD.player.mesh.position.x,
                                         WORLD.player.mesh.position.y,
                                         WORLD.player.mesh.position.z]});
    }).keyup(function(e) {
        var k;
        e.preventDefault();
        k = (e.keyCode ? e.keyCode : e.which);
        if (k in keys) {
            keys[k] = false;
        }
    });

    $(document).click(function(e) {
        emit_attack();
    });

    document.addEventListener("mousemove", function (e) {
        var theta = Math.PI/360.0;

        move_x = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
        move_y = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

        //WORLD.player_geometry.rotation.y -= moveX*0.01;
        //WORLD.player.mesh.rotation.x -= moveY*0.01;
    });

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
            game.entities.push(new Player(game, p,
                               //WORLD.player_geometry,
                               new THREE.Mesh(WORLD.player_geometry,
                                              WORLD.player_material),
                               true));

            game.entities[p].mesh.position.x = server_entities[p][0];
            game.entities[p].mesh.position.z = server_entities[p][1];
            game.entities[p].mesh.castShadow = true;
            game.entities[p].mesh.receiveShadow = true;
            WORLD.scene.add(game.entities[p].mesh);
        }
        WORLD.player = game.entities[game.entities.length-1];
        WORLD.player.mesh.add(WORLD.camera);
    });

    socket.on('addPlayer', function(new_id) {
        game.entities.push(new Player(game, new_id,
                           //WORLD.player_geometry,
                           new THREE.Mesh(WORLD.player_geometry,
                                          WORLD.player_material),
                           true));

        game.entities[game.entities.length-1].castShadow = true;
        game.entities[game.entities.length-1].receiveShadow = true;

        WORLD.scene.add(game.entities[game.entities.length-1].mesh);
    });

    socket.on('disconnect', function() {
        alert('Damn, connection broken.' + id);
        socket.emit('playerDisconnect', {"id": id});
    });

    /*
     * data: {"id":id, "pos":[x,y,z]}
     */
    socket.on('updatePlayer', function(data) {
        var id = data.id;

        game.entities[id].mesh.position.x = data.pos[0];
        game.entities[id].mesh.position.y = data.pos[1];
        game.entities[id].mesh.position.z = data.pos[2];
    });
});
