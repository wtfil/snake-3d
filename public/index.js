var width = window.innerWidth;
var height = window.innerHeight;
width = height;
var cos = Math.cos;
var sin = Math.sin;
var PI = Math.PI;
var PI_2 = Math.PI / 2;
var R = 3.5;

var THREE = require('three');
var debounce = require('debounce');
var levels = require('./js/levels');
var renderLoop = require('./js/core/render-loop');
var gameLoop = require('./js/core/game-loop');

var camera = require('./js/camera')({
    width: width,
    height: height
});

var Snake = require('./js/snake');
var scene = levels.get('simple');

var snake = new Snake({
    vx: 1,
    vy: 0,
    position: [5, 5],
    length: 5
});

snake.appendToScene(scene);

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(width, height);
renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = false;

renderer.shadowCameraNear = 3;
renderer.shadowCameraFar = camera.far;
renderer.shadowCameraFov = 50;

renderer.shadowMapBias = 0.0039;
renderer.shadowMapDarkness = 0.5;
renderer.shadowMapWidth = 1024;
renderer.shadowMapHeight = 1024;
renderer.domElement.width = width;
renderer.domElement.height = height;
document.body.appendChild(renderer.domElement);

var v = 0.05;
var z = R;
var vx = 0;
var vy = v;
var side = 1;
var vr = PI_2 / 10;
var roll = 0;
var pitch = PI / 3;

window.addEventListener('keypress', debounce(onKeyPressed, 200, true));

function onKeyPressed(e) {
    var code = e.keyCode;

    // 119 87 1094 1062 w
    // 115 83 1099 1067 s
    // 97 65 1092 1064 a
    // 100 68 1074 1042 d
    // 114 r
    // 112 p

    if ([100, 68, 1074, 1042].indexOf(code) !== -1) {
        camera.turnRight();
    }

    if ([97, 65, 1064, 1092].indexOf(code) !== -1) {
        camera.turnLeft();
    }

    if ([114].indexOf(code) !== -1) {
        camera.invertSide();
    }

    if ([112].indexOf(code) !== -1) {
        gameLoop.pause();
    }

}


renderLoop(function () {
    renderer.render(scene, camera);
});
