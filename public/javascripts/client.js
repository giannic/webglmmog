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

    // landscape
    WORLD.plane_material = new THREE.MeshLambertMaterial({color: 0xEEEEEE});
    WORLD.plane_geometry = new THREE.PlaneGeometry(6000, 6000, 100, 100);
    WORLD.plane_mesh = new THREE.Mesh(WORLD.plane_geometry, WORLD.plane_material);
    WORLD.plane_mesh.overdraw = true;
    WORLD.plane_mesh.rotation.x = -Math.PI / 2;
    WORLD.plane_mesh.position.y = -20;
    WORLD.plane_mesh.receiveShadow = true;

    // player params
    init_player();


    // bullets config
    WORLD.bullet_material = new THREE.MeshLambertMaterial({color: 0xEEEEEE});
    WORLD.bullet_geometry = new THREE.SphereGeometry(BULLET_RADIUS, BULLET_SEG_X, BULLET_SEG_Y);

    WORLD.scene.add(WORLD.plane_mesh);
}

function init_environment() {
    var url_prefix = "../images/";
    var urls = [
        url_prefix + 'skybox_xpos.jpg',
        url_prefix + 'skybox_xneg.jpg',
        url_prefix + 'skybox_ypos.jpg',
        url_prefix + 'skybox_yneg.jpg',
        url_prefix + 'skybox_zpos.jpg',
        url_prefix + 'skybox_zneg.jpg'
    ],

    cubemap = THREE.ImageUtils.loadTextureCube(urls);
    cubemap.format = THREE.RGBFormat;

    var shader = THREE.ShaderLib["cube"];
    //var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
    var uniforms = shader.uniforms;
    uniforms['tCube'].texture = cubemap;

    var material = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: uniforms
    });

    var env = new THREE.Mesh(new THREE.CubeGeometry(
                                     ENV_SIZE, ENV_SIZE, ENV_SIZE,
                                     1, 1, 1),
                             material)

    env.doubleSided = true;

    WORLD.scene.add(env);
}

function init_light() {
    // lighting
    // WORLD.light = new THREE.SpotLight(0xEEFFFF);
    // WORLD.light.position.set(170, 2030, -160);
    // WORLD.light.castShadow = true;
    // WORLD.light.intensity = 0.7;

    WORLD.light = new THREE.DirectionalLight(0xEEFFFF);
    WORLD.light.position.set(1, 5, 1);
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

    WORLD.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    WORLD.camera.useQuaternion = true;
    WORLD.camera.position.z = 500;
    WORLD.camera.position.y = 100;
    //WORLD.scene.add(WORLD.camera);
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

    loader = new THREE.OBJLoader();
    //loader.load("../obj/Spaceship01.obj", function(object) {
    loader.load("../obj/Spaceship01.obj", function(object) {
        object.rotation.y = Math.PI / 2;
        object.position.y = 10;
        WORLD.player_geometry = object;
    });
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
    v = v.applyMatrix4(WORLD.camera.matrixWorld);
    var dir = new THREE.Vector3(0,0,0);
    dir.copy(WORLD.player.mesh.position);
    dir.sub(v).setLength(BULLET_VELOCITY);

    game.bullets.push(new Bullet(game,
                                 dir,
                                 new THREE.Mesh(WORLD.bullet_geometry,
                                                WORLD.bullet_material))
                     );

    game.bullets[game.bullets.length-1].mesh.position.copy(WORLD.player.mesh.position);
    WORLD.scene.add(game.bullets[game.bullets.length-1].mesh);
}
