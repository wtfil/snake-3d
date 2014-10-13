var THREE = require('three');
var components = require('./levels/components');

function Snake(options) {
    if (options.length < 2) {
        throw new Error('Snake could not be less then 2 bars lenght');
    }
    Array.call(this);

    this.length = options.length;
    this._vx = options.vx;
    this._vy = options.vy;
    this._fill(options);
}

Snake.prototype = Object.create(Array.prototype);

Snake.prototype._fill = function(options) {
    var headPosition = new THREE.Vector3(options.position[0], options.position[1], 0);
    var position = headPosition;
    var i = 1;

    this.push(components.head({position: position}));

    for (; i < this.length - 1; i ++) {
        position = position.clone();
        position.x -= this._vx;
        position.y -= this._vy;
        this[i] = components.segment({position: position, color: 0xffffff});
    }
    console.log('items')
    console.log(this)
};

Snake.prototype.appendToScene = function(scene) {
    console.log(this, this[0])
    this.forEach(function (item) {
        console.log(item);
        scene.add(item);
    });
};

module.exports = Snake;
