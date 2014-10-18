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

function Camera(options) {
    THREE.PerspectiveCamera.call(this, 75, options.ratio, 0.1, 13);

    this.rotation.order = 'ZXY';
    this.rotation.x = PITCH;

    this.position.x = options.position[0];
    this.position.y = options.position[1];
    this.position.z = DEFAULT_Z;

    this._side = 1 // or -1
    this._vx = options.vx;
    this._vy = options.vy;
    this._z = this.position.z;
    this._pitch = this.rotation.x;

    this._roll = 0;
    this._fixRoll();
    this.rotation.z = this._roll;

    gameLoop.add(this._onGameLoop.bind(this));
}
Camera.prototype = Object.create(THREE.PerspectiveCamera.prototype);

Camera.prototype._onGameLoop = function () {

    this.rotation.x = reachingAim(this.rotation.x, this._pitch, V_PITCH);
    this.rotation.z = reachingAim(this.rotation.z, this._roll, V_ROLL);
    this.position.z = reachingAim(this.position.z, this._z, V_Z);

}

function getRoll(vx, vy) {
    var mewRoll;
    if (vy > 0) {
        newRoll = 0;
    } else if (vy < 0) {
        newRoll = PI;
    } else if (vx > 0) {
        newRoll = -PI_2;
    } else {
        newRoll = PI_2;
    }
    return newRoll;
}

Camera.prototype.follow = function (object, distance) {
    var _this = this;

    gameLoop.add(function () {
        var a = getRoll(object.vx, object.vy) - PI_2;
        _this.position.x = object.position.x + distance * cos(a);
        _this.position.y = object.position.y + distance * sin(a);
        _this._vx = object.vx;
        _this._vy = object.vy;
        _this._fixRoll();
    })
}

Camera.prototype.invertSide = function () {
    this._vx = -this._vx;
    this._vy = -this._vy;
    this._side = -this._side;
    this._pitch -= PI;
    this._z = -this._z;
    this.fixRoll();
}

Camera.prototype._fixRoll = function () {
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
    var camera = new Camera(options);
    return camera;
}
