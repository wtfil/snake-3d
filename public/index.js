require('./js/stats');

var width = window.innerWidth;
var height = window.innerHeight;
var RATIO = 3 / 4
if (height * RATIO > width) {
	height = width / RATIO;
} else {
	width = height * RATIO;
}

var THREE = require('three');
var control = require('./js/control');
var levels = require('./js/levels');
var renderLoop = require('./js/core/render-loop');
var gameLoop = require('./js/core/game-loop');

var collisions = require('./js/collisions');

var camera = require('./js/camera')({
    ratio: width / height
});

var snake = require('./js/snake')({
    direction: {
        x: 1,
        y: 0
    },
    position: {
        x: 5,
        y: 5
    },
    length: 5
})


camera.follow(snake.getHead(), 3);
var scene = levels.get('simple');
snake.appendToScene(scene);

// TODO move this somewhere
gameLoop.add(function () {
    var heads = [snake.getHead().object];

    if (collisions(heads, scene.walls)) {
        gameLoop.pause();
    } else if (collisions(heads, scene.coins)) {
        scene.replaceCoin();
        snake.extend();
    }

});


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

control
	.on('left', snake.turnLeft.bind(snake))
	.on('right', snake.turnRight.bind(snake))
	.on('pause', gameLoop.pause);

setTimeout(function () {
    renderLoop(function () {
        renderer.render(scene, camera);
    });
});
