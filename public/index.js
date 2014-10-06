var cos = Math.cos;
var sin = Math.sin;
var PI = Math.PI;
var PI_2 = Math.PI / 2;
var R = 2;

var THREE = require('three');
var debounce = require('debounce');
var levels = require('./js/levels');
var renderLoop = require('./js/core/render-loop');
var gameLoop = require('./js/core/game-loop');
require('./js/stats');

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = R;
camera.rotation.order = 'ZXY';
camera.rotation.x = PI / 3;
window.camera = camera;

var scene = levels.random(20);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var v = 0.05;
var vx = 0;
var vy = v;
var side = 1;
var vr = PI_2 / 10;
var roll = 0;

window.addEventListener('keypress', debounce(onKeyPressed, 200, true));

function onKeyPressed(e) {
    var code = e.keyCode;

    // 119 87 1094 1062 w
    // 115 83 1099 1067 s
    // 97 65 1092 1064 a
    // 100 68 1074 1042 d
    // 114 r

    if ([100, 68, 1074, 1042].indexOf(code) !== -1) {
        turnRight();
    }

    if ([97, 65, 1064, 1092].indexOf(code) !== -1) {
        turnLeft();
    }
    if ([114].indexOf(code) !== -1) {
        invertSide();
    }

    updateRoll();

}

function invertSide() {
    vx = -vx;
    vy = -vy;
    side = -side;
    camera.position.z = -camera.position.z;
    camera.rotation.x += PI;
}

function updateRoll() {
    var newRoll;
    if (vy === v) {
        newRoll = 0;
    } else if (vy === -v) {
        newRoll = PI;
    } else if (vx === v) {
        newRoll = -PI_2;
    } else {
        newRoll = PI_2;
    }

    if (side < 0) {
        newRoll += PI;
    }

    while (newRoll > roll + PI_2) {
        newRoll -= 2 * PI;
    }
    while (newRoll < roll - PI_2) {
        newRoll += 2 * PI;
    }

    roll = newRoll;
}

function turnRight() {
    if (vy !== 0) {
        vx = vy;
        vy = 0;
    } else {
        vy = -vx;
        vx = 0;
    }
}

function turnLeft() {
    if (vy !== 0) {
        vx = -vy;
        vy = 0;
    } else {
        vy = vx;
        vx = 0;
    }
}

gameLoop.add(function () {

    var droll = roll - camera.rotation.z;
    camera.position.x += vx;
    camera.position.y += vy;

    if (Math.abs(droll) > 0.01) {
        camera.rotation.z += droll > 0 ? vr : -vr;
    }

});

renderLoop(function () {
    renderer.render(scene, camera);
});
