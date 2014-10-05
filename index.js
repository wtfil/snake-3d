var cos = Math.cos;
var sin = Math.sin;
var PI = Math.PI;
var PI_2 = Math.PI / 2;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

var geometry = new THREE.SphereGeometry(3, 100, 100);
var material = new THREE.MeshBasicMaterial({
    //color: 0x00ff00,
    //wireframe: true
    map: THREE.ImageUtils.loadTexture('worldatlas.JPG')
});
var cube = new THREE.Mesh( geometry, material );

scene.add( cube );


var R = 3.2
camera.position.z = R;
camera.rotation.x = PI_2;
camera.rotation.order = 'YXZ';
document.body.appendChild( renderer.domElement );


var alpha = 0; teta = 0;
var v = 0.05;
window.addEventListener('keypress', function (e) {
    var code = e.keyCode;
    // 119 w
    // 115 s
    // 97 a
    // 100 d
    if (code === 119) {
        teta += v;
    }
    if (code === 115) {
        teta -= v;
    }
    if (code === 100) {
        alpha += v;
    }
    if (code === 97) {
        alpha -= v;
    }

    camera.position.y = sin(teta) * R;
    camera.position.z = cos(teta) * cos(alpha) * R;
    camera.position.x = cos(teta) * sin(alpha) * R;

    camera.rotation.x = PI_2 - teta;
    camera.rotation.y = alpha;
});

;(function renderTick() {
    requestAnimationFrame(renderTick);
    renderer.render(scene, camera);
}());
