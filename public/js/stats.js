var Stats = require('stats-js');
var stats = new Stats();
var renderLoop = require('./core/render-loop');

stats.setMode(0);
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
stats.domElement.style.zIndex = '1';
document.body.appendChild( stats.domElement );

renderLoop( function () {
    stats.begin();
    stats.end();
}, 1000 / 60 );
