/*************************
 * CLIENT INIT FUNCTIONS *
 *************************/

/*
 * FPS Counter
 */
function init_stats() {
    WORLD.stats = new Stats();
    WORLD.stats.domElement.style.position = 'absolute';
    WORLD.stats.domElement.style.top = '0px';
    WORLD.stats.domElement.style.left = '0px';
    document.body.appendChild(WORLD.stats.domElement);
}

/*
 * Main Caller for all inits
 */
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

/*
 * Ground plane
 */
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

/*
 * Skybox
 */
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

/*
 * Scene lighting
 */
function init_light() {
    WORLD.light = new THREE.DirectionalLight(0xEEFFFF);
    WORLD.light.position.set(1, 10, 1);
    WORLD.light.castShadow = true;
    WORLD.light.intensity = 0.8;

    WORLD.scene.add(WORLD.light);
}

/*
 * Camera
 */
function init_client() {
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
    socket.emit("new_bullet", {"pos": game.bullets[game.bullets.length-1].mesh.position, "dir": dir});
}
