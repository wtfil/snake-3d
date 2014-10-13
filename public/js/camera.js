var THREE = require('three');
var gameLoop = require('./core/game-loop');
var cos = Math.cos;
var sin = Math.sin;
var PI = Math.PI;
var PI_2 = Math.PI / 2;

var DEFAULT_Z = 2.5;
var PITCH  = PI / 4;
var V_ROLL = PI / 20;
var V_PITCH = PI / 10;
var V_Z = DEFAULT_Z / 10;
var V = 0.05;
V /= 10;

function Camera() {
    THREE.PerspectiveCamera.apply(this, arguments);

    this.position.z = DEFAULT_Z;
    this.rotation.order = 'ZXY';
    this.rotation.x = PITCH;
    this.position.x = 3;
    this.position.y = 5;

    this._side = 1 // or -1
    this._vx = 0;
    this._vy = V;
    this._z = this.position.z;
    this._roll = this.rotation.z;
    this._pitch = this.rotation.x;
    gameLoop.add(this._onGameLoop.bind(this));
}
Camera.prototype = Object.create(THREE.PerspectiveCamera.prototype);

Camera.prototype._onGameLoop = function () {
    this.position.x += this._vx;
    this.position.y += this._vy;
    this.rotation.x = reachingAim(this.rotation.x, this._pitch, V_PITCH);
    this.rotation.z = reachingAim(this.rotation.z, this._roll, V_ROLL);
    this.position.z = reachingAim(this.position.z, this._z, V_Z);
}

Camera.prototype.turnLeft = function () {
    if (this._vy !== 0) {
        this._vx = -this._vy * this._side;
        this._vy = 0;
    } else {
        this._vy = this._vx * this._side;
        this._vx = 0;
    }
    this.fixRoll();
}

Camera.prototype.turnRight = function () {
    if (this._vy !== 0) {
        this._vx = this._vy * this._side;
        this._vy = 0;
    } else {
        this._vy = -this._vx * this._side;
        this._vx = 0;
    }
    this.fixRoll();
}

Camera.prototype.invertSide = function () {
    this._vx = -this._vx;
    this._vy = -this._vy;
    this._side = -this._side;
    this._pitch -= PI;
    this._z = -this._z;
    this.fixRoll();
}

Camera.prototype.fixRoll = function () {
    var newRoll;

    if (this._vy > 0) {
        newRoll = 0;
    } else if (this._vy < 0) {
        newRoll = PI;
    } else if (this._vx > 0) {
        newRoll = -PI_2;
    } else {
        newRoll = PI_2;
    }

    if (this._side < 0) {
        newRoll += PI;
    }

    while (newRoll > this._roll + PI_2) {
        newRoll -= 2 * PI;
    }
    while (newRoll < this._roll - PI_2) {
        newRoll += 2 * PI;
    }

    this._roll = newRoll;
}


function reachingAim (current, aim, step) {
    var diff = aim - current;

    if (Math.abs(diff) > step) {
        return current + (diff > 0 ? step : -step);
    }

    return aim;
}

module.exports = function (options) {
    var camera = new Camera(75, options.width / options.height, 0.1, 13);

    return camera;
}
