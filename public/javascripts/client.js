function init_stats() {
    WORLD.stats = new Stats();
    WORLD.stats.domElement.style.position = 'absolute';
    WORLD.stats.domElement.style.top = '0px';
    document.body.appendChild(WORLD.stats.domElement);
}

function init_world() {
    // scene
    WORLD.scene = new THREE.Scene();
    WORLD.scene.fog = new THREE.FogExp2(0xFFFFFF, 0.0006);

    init_environment();

    init_light();

    init_landscape();

    // player params
    init_player();

    // bullets config
    WORLD.bullet_material = new THREE.MeshLambertMaterial({color: 0xEEEEEE});
    WORLD.bullet_geometry = new THREE.SphereGeometry(BULLET_RADIUS, BULLET_SEG_X, BULLET_SEG_Y);

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
    var format = ".jpg";
    var urls = [
        IMG_PATH + 'skybox_xpos' + format,
        IMG_PATH + 'skybox_xneg' + format,
        IMG_PATH + 'skybox_ypos' + format,
        IMG_PATH + 'skybox_yneg' + format,
        IMG_PATH + 'skybox_zpos' + format,
        IMG_PATH + 'skybox_zneg' + format
    ];

    var cubemap = THREE.ImageUtils.loadTextureCube(urls);
    cubemap.format = THREE.RGBFormat;

    //var shader = THREE.ShaderLib["cube"];
    var shader = THREE.ShaderUtils.lib["cube"];
    shader.uniforms["tCube"].value = cubemap;

    var material = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
    });

    var env = new THREE.Mesh(new THREE.CubeGeometry(
                                     ENV_SIZE, ENV_SIZE, ENV_SIZE),
                             material)

    WORLD.scene.add(env);
}

function init_light() {
    /*
    var ambient = new THREE.AmbientLight(0xffffff);
    WORLD.scene.add(ambient);

    var point = new THREE.PointLight(0xffffff, 2);
    WORLD.scene.add(point);
    */

    // lighting
    //var light = new THREE.SpotLight(0xFFFFFF);
    var light = new THREE.SpotLight();
    //light.position.set(170, 2030, -160);
    light.position.set(0, 500, 0);
    light.castShadow = true;
    light.intensity = 0.7;

    WORLD.light = new THREE.DirectionalLight(0xEEFFFF);
    WORLD.light.position.set(1, 5, 1);
    WORLD.light.castShadow = true;
    WORLD.light.intensity = 0.8;

    WORLD.scene.add(WORLD.light);
    WORLD.scene.add(light);
}

function init_client() {
    /* // non-working pointer lock code
    var element = $('canvas')[0];
    element.requestPointerLock = element.requestPointerLock ||
                                 element.mozRequestPointerLock ||
                                 element.webkitRequestPointerLock;

    element.requestPointerLock();
    */

    WORLD.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, ENV_SIZE);
    WORLD.camera.useQuaternion = true;
    WORLD.camera.position.z = 500;
    WORLD.camera.position.y = 100;
}

function init_player() {
    /*
    WORLD.player_material = new THREE.MeshLambertMaterial({color: 0xEEEEEE});
    WORLD.player_material_hit = new THREE.MeshLambertMaterial({color: 0xFF0000});
    WORLD.player_geometry = new THREE.SphereGeometry(PLAYER_RADIUS, PLAYER_SEG_X, PLAYER_SEG_Y);
    */
    var loader;
    WORLD.player_material = new THREE.MeshLambertMaterial({color: 0xEEEEEE});
    WORLD.player_material_hit = new THREE.MeshLambertMaterial({color: 0xFF0000});

    loader = new THREE.OBJMTLLoader();
    loader.addEventListener('load', function(event) {
        //object.rotation.y = Math.PI / 2;
        var object = event.content;
        object.position.y = 10;
        WORLD.player_geometry = object;
    });
    loader.load(OBJ_PATH + "Feisar_Ship01.obj",
                OBJ_PATH + "Feisar_Ship01.mtl");
}

// currently not in use
function detect_collisions() {
    var origin,
        local_vertex, global_vertex,
        direction, ray,
        i, results;

    origin = WORLD.player_mesh.position.clone();

    for (i = 0; i < WORLD.player_mesh.geometry.vertices.length; i++) {
        local_vertex = WORLD.player_mesh.vertices[i].clone();
        global_vertex = local_vertex.applyMatrix4(WORLD.player_mesh.matrix);
        direction = global_vertex.sub(WORLD.player_mesh.position);

        ray = new THREE.Raycaster(origin, direction.clone().normalize());
        results = ray.intersectObjects(game.entities);
        if (results.length > 0 && results[0].distance < direction.length()) {
        }
    }
}

/*
 * Launch a bullet from this player
 */
function emit_attack() {
    var v = new THREE.Vector3(0,0,-1);
    // r57
    //v = v.applyMatrix4(WORLD.camera.matrixWorld);
    v = WORLD.camera.matrixWorld.multiplyVector3(v);
    var dir = new THREE.Vector3(0,0,0);
    dir.copy(WORLD.player.mesh.position);
    //r57
    //dir.sub(v).setLength(BULLET_VELOCITY);
    dir.subSelf(v).setLength(BULLET_VELOCITY);

    game.bullets.push(new Bullet(game,
                                 dir,
                                 new THREE.Mesh(WORLD.bullet_geometry,
                                                WORLD.bullet_material))
                     );

    game.bullets[game.bullets.length-1].mesh.position.copy(WORLD.player.mesh.position);
    WORLD.scene.add(game.bullets[game.bullets.length-1].mesh);
}
