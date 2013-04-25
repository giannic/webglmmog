/*
 * Modified from Clouds by MRDOOB
 */

var geometry, mesh, material;
function render_clouds() {
    geometry = new THREE.Geometry();

    var texture = THREE.ImageUtils.loadTexture('images/cloud.png');
    texture.magFilter = THREE.LinearMipMapLinearFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;

    //var fog = new THREE.Fog( 0x4584b4, - 100, 3000 );
    var fog = new THREE.Fog( 0xd7e1e9, - 100, 3000 );

    material = new THREE.ShaderMaterial( {
        uniforms: {

             "map": { type: "t", value: texture },
             "fogColor" : { type: "c", value: fog.color },
             "fogNear" : { type: "f", value: fog.near },
             "fogFar" : { type: "f", value: fog.far },
             "uOpacity": 0.1

        },
             vertexShader: document.getElementById( 'vs' ).textContent,
             fragmentShader: document.getElementById( 'fs' ).textContent,
             depthWrite: false,
             depthTest: false,
             transparent: true
    } );

    var plane = new THREE.Mesh( new THREE.PlaneGeometry( 64, 64 ) );

    var NUM_CLUSTERS = 50;
    var CLOUDS_PER_CLUSTER = 20;
    var CLUSTER_RANGE = 2000;
    var CLOUD_MAX_SIZE = 70.5;
    var CLOUD_MIN_SIZE = 10.5;

    var cluster_center = {x:0, y:0, z:0};
    for ( var i = 0; i < NUM_CLUSTERS; i++ ) {
        cluster_center.x = Math.random() * CONFIG.ENV_SIZE - CONFIG.ENV_SIZE/2;
        cluster_center.y = Math.random() * CONFIG.ENV_SIZE - CONFIG.ENV_SIZE/2;
        cluster_center.z = Math.random() * CONFIG.ENV_SIZE - CONFIG.ENV_SIZE/2;

        for (var j = 0; j < CLOUDS_PER_CLUSTER; j++) {
            plane.position.x = cluster_center.x + Math.random() * CLUSTER_RANGE - CLUSTER_RANGE/2;
            plane.position.y = cluster_center.y + Math.random() * CLUSTER_RANGE - CLUSTER_RANGE/2;
            plane.position.z = cluster_center.z + Math.random() * CLUSTER_RANGE - CLUSTER_RANGE/2;

            plane.rotation.y = Math.random() * Math.PI;
            plane.rotation.z = Math.random() * Math.PI;

            plane.scale.x = plane.scale.z = Math.random() * Math.random() * CLOUD_MAX_SIZE + CLOUD_MIN_SIZE;
            plane.scale.y = plane.scale.x / 1.5;
            THREE.GeometryUtils.merge( geometry, plane );
        }
    }

    mesh = new THREE.Mesh( geometry, material );
    mesh.material.side = THREE.DoubleSide;
    WORLD.scene.add( mesh );
}
