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

    // lighting
    light = new THREE.SpotLight(0xEEFFFF);
    light.position.set(170, 2030, -160);
    light.castShadow = true;
    light.intensity = 0.7;

    // landscape
    WORLD.plane_material = new THREE.MeshLambertMaterial({color: 0xEEEEEE});
    WORLD.plane_geometry = new THREE.PlaneGeometry(6000, 6000, 100, 100);
    WORLD.plane_mesh = new THREE.Mesh(WORLD.plane_geometry, WORLD.plane_material);
    WORLD.plane_mesh.overdraw = true;
    WORLD.plane_mesh.rotation.x = -Math.PI / 2;
    WORLD.plane_mesh.position.y = -20;
    WORLD.plane_mesh.receiveShadow = true;

    WORLD.scene.add(light);
    WORLD.scene.add(WORLD.plane_mesh);
}

function init_client() {
    WORLD.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    WORLD.camera.position.z = 500;
    WORLD.camera.position.y = 100;


    WORLD.player_material = new THREE.MeshLambertMaterial({color: 0xEEEEEE});
    WORLD.player_geometry = new THREE.SphereGeometry(20, 10, 10);
    /*
    WORLD.player_mesh = new THREE.Mesh(WORLD.player_geometry, WORLD.player_material);
    WORLD.player_mesh.castShadow = true;
    WORLD.player_mesh.receiveShadow = true;

    WORLD.scene.add(WORLD.player_mesh);
    WORLD.player_mesh.add(WORLD.camera);
    */
}
