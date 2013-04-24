/******************
 * INIT FUNCTIONS *
 ******************/
function init_stats() {
    WORLD.stats = new Stats();
    WORLD.stats.domElement.style.position = 'absolute';
    WORLD.stats.domElement.style.top = '0px';
    WORLD.stats.domElement.style.left = '0px';
    document.body.appendChild(WORLD.stats.domElement);
}

function init_world() {
    // scene
    WORLD.scene = new THREE.Scene();
    WORLD.scene.fog = new THREE.FogExp2(0x000000, 0.0006);

    init_environment();

    //init_landscape();

    init_player();

    init_light();

    // bullets config
    WORLD.bullet_material = new THREE.MeshLambertMaterial({color: 0xEEEEEE});
    WORLD.bullet_geometry = new THREE.SphereGeometry(CONFIG.BULLET_RADIUS,
                                                     CONFIG.BULLET_SEG_X,
                                                     CONFIG.BULLET_SEG_Y);

}

function init_landscape() {
    WORLD.plane_material = new THREE.MeshLambertMaterial({color: 0xEEEEEE});
    WORLD.plane_geometry = new THREE.PlaneGeometry(6000, 6000, 100, 100);
    WORLD.plane_mesh = new THREE.Mesh(WORLD.plane_geometry, WORLD.plane_material);
    WORLD.plane_mesh.overdraw = true;
    WORLD.plane_mesh.rotation.x = -Math.PI / 2;
    WORLD.plane_mesh.position.y = -20;
    WORLD.plane_mesh.receiveShadow = true;

    WORLD.scene.add(WORLD.plane_mesh);
}

function init_environment() {
    var cubemap, env, shader, materal,
        urls, format;

    format = ".jpg";
    urls = [
        CONFIG.IMG_PATH + 'skybox_xpos' + format,
        CONFIG.IMG_PATH + 'skybox_xneg' + format,
        CONFIG.IMG_PATH + 'skybox_ypos' + format,
        CONFIG.IMG_PATH + 'skybox_yneg' + format,
        CONFIG.IMG_PATH + 'skybox_zpos' + format,
        CONFIG.IMG_PATH + 'skybox_zneg' + format
    ];

    cubemap = THREE.ImageUtils.loadTextureCube(urls);
    cubemap.format = THREE.RGBFormat;

    shader = THREE.ShaderLib["cube"];
    //shader = THREE.ShaderUtils.lib["cube"]; // r54
    shader.uniforms["tCube"].value = cubemap;

    material = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
    });

    env = new THREE.Mesh(
          new THREE.CubeGeometry(CONFIG.ENV_SIZE,
                                 CONFIG.ENV_SIZE,
                                 CONFIG.ENV_SIZE),
              material);

    WORLD.scene.add(env);
}

function init_light() {
    WORLD.light = new THREE.DirectionalLight(0xEEFFFF);
    WORLD.light.position.set(1, 10, 1);
    WORLD.light.castShadow = true;
    WORLD.light.intensity = 0.8;

    WORLD.scene.add(WORLD.light);
}

function init_client() {
    /* // non-working pointer lock code
    var element = $('canvas')[0];
    element.requestPointerLock = element.requestPointerLock ||
                                 element.mozRequestPointerLock ||
                                 element.webkitRequestPointerLock;

    element.requestPointerLock();
    */

    WORLD.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, CONFIG.ENV_SIZE);
    WORLD.camera.useQuaternion = true;
    WORLD.camera.position.z = 500;
    WORLD.camera.position.y = 100;

    socket.emit("client_complete"); // may not be the best place to put this
}

function init_player() {
    WORLD.player_material = new THREE.MeshLambertMaterial({color: 0xEEEEEE});
    WORLD.player_material_hit = new THREE.MeshLambertMaterial({color: 0xFF0000});

    var loader;

    loader = new THREE.BinaryLoader(true);
    loader.load(CONFIG.OBJ_PATH + "Feisar_Ship01.js", function(object) {
        WORLD.player_geometry = object;
        console.log("harrow loading geometry"); // OMGZOR GEOMETRY NOT LOADED
    });
}

// currently not in use
/*
function detect_collisions() {
    var origin,
        local_vertex, global_vertex,
        direction, ray,
        i, results;

    origin = WORLD.player_mesh.position.clone();

    for (i = 0; i < WORLD.player_mesh.geometry.vertices.length; i++) {
        local_vertex = WORLD.player_mesh.vertices[i].clone();
        global_vertex = local_vertex.applyMatrix4(WORLD.player_mesh.matrix);

        // r54
        //direction = global_vertex.sub(WORLD.player_mesh.position);

        // r58
        direction.subVectors(global_vertex, WORLD.player_mesh.position);

        ray = new THREE.Raycaster(origin, direction.clone().normalize());
        results = ray.intersectObjects(game.entities);
        if (results.length > 0 && results[0].distance < direction.length()) {
        }
    }
}
*/


/********************
 * UPDATE FUNCTIONS *
 ********************/

/*
 * Gets the direction of the vector from the camera to the player
 * Output: THREE.Vector3 In World Coordinates
 */
function get_my_direction() {
    var v, dir;

    v = new THREE.Vector3(0,0,-1);
    //v = WORLD.camera.matrixWorld.multiplyVector3(v); // r54
    v.applyMatrix4(WORLD.camera.matrixWorld); // r58

    //dir.sub(v).setLength(BULLET_VELOCITY); // r58
    dir = new THREE.Vector3(0,0,0);
    dir.copy(WORLD.player.mesh.position);

    //dir.subSelf(v); // r54
    dir.subVectors(dir, v); // r58
    //dir.sub(v);

    return dir;
}

/*
 * Launch a bullet from this player
 */
function emit_attack() {
    var dir;
    dir = get_my_direction();
    dir.setLength(CONFIG.BULLET_VELOCITY);

    game.bullets.push(new TYPE.Bullet(game,
                                 dir,
                                 new THREE.Mesh(WORLD.bullet_geometry,
                                                WORLD.bullet_material))
                     );

    game.bullets[game.bullets.length-1].mesh.position.copy(WORLD.player.mesh.position);
    WORLD.scene.add(game.bullets[game.bullets.length-1].mesh);

    // tell the other plays i fired
    //socket.emit("new_bullet", {"pos": pos, "dir": dir});
}
