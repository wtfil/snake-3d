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
    var i = 0;
    var singX = Math.abs(this._vx) / this._vx;
    var singY = Math.abs(this._vy) / this._vy;

    for (; i < this.length; i ++) {
        position = position.clone();
        this[i] = components.segment({position: position, color: 0xffffff});
        position.x -= singX;
        position.y -= singY;
    }
};

Snake.prototype.appendToScene = function(scene) {
    this.forEach(function (item) {
        scene.add(item);
    });
};

module.exports = function (options) {
    return new Snake(options);
};
