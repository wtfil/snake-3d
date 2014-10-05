var cos = Math.cos;
var sin = Math.sin;
var PI = Math.PI;
var PI_2 = Math.PI / 2;
var R = 2;

var THREE = require('three');
var levels = require('./js/levels');

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = R;
camera.rotation.x = PI / 3;
//camera.rotation.order = 'YXZ';

var scene = levels.random(20);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('keypress', function (e) {
    var code = e.keyCode;
    // 119 w
    // 115 s
    // 97 a
    // 100 d
    if (code === 119) {
        camera.position.y += 1;
    }
    if (code === 115) {
        camera.position.y -= 1;
    }
    if (code === 100) {
        camera.position.x += 1;
    }
    if (code === 97) {
        camera.position.x -= 1;
    }

});

;(function renderTick() {
    requestAnimationFrame(renderTick);
    renderer.render(scene, camera);
}());
