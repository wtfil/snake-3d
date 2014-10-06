var stats = new Stats();
var gameLoop = require('./core/game-loop');
stats.setMode(0);

stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

document.body.appendChild( stats.domElement );

gameLoop.add(function () {
    stats.begin();
    stats.end();
});
