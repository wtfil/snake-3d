var THREE = require('three');
var gameLoop = require('./core/game-loop');

var cos = Math.cos;
var sin = Math.sin;
var PI = Math.PI;
var PI_2 = Math.PI / 2;

var DEFAULT_Z = 3.5;
var PITCH  = PI / 5;
var V_ROLL = PI / 20;
var V_PITCH = PI / 10;
var V_Z = DEFAULT_Z / 10;

function Camera(options) {
    THREE.PerspectiveCamera.call(this, 75, options.ratio, 0.1, 13);

    this.rotation.order = 'ZXY';
    this.rotation.x = PITCH;

    this.position.z = DEFAULT_Z;

    this._side = 1 // or -1
    this._z = this.position.z;
    this._pitch = this.rotation.x;

    gameLoop.add(this._onGameLoop.bind(this));
}

Camera.prototype = Object.create(THREE.PerspectiveCamera.prototype);

Camera.prototype._onGameLoop = function () {
    this.rotation.x = reachingAim(this.rotation.x, this._pitch, V_PITCH);
    this.position.z = reachingAim(this.position.z, this._z, V_Z);
};

function getRoll(vx, vy, current) {
    var roll;
    if (vy > 0) {
        roll = -PI_2;
    } else if (vy < 0) {
        roll = PI_2;
    } else if (vx > 0) {
        roll = PI;
    } else {
        roll = 0;
    }

    while (roll > current + PI) {
        roll -= 2 * PI;
    }
    while (roll < current - PI) {
        roll += 2 * PI;
    }

    return roll;
}

function getSign(val) {
    return val && (val > 0 ? 1 : -1);
}

Camera.prototype.follow = function (object, distance) {

    var _this = this;
    var angle = getRoll(object.vx, object.vy, 0);
    var step = 0.05;

    this.position.x = object.position.x + distance * cos(angle);
    this.position.y = object.position.y + distance * sin(angle);

    gameLoop.add(function () {
        var current = getRoll(object.vx, object.vy, angle);
        var diff = current - angle;

        if (Math.abs(diff) > step / 2) {
            angle += step * getSign(diff);
        } else {
            angle = current;
        }

        _this.position.x = object.position.x + distance * cos(angle);
        _this.position.y = object.position.y + distance * sin(angle);
        _this.rotation.z = angle + PI_2;
    })
};

Camera.prototype.invertSide = function () {
    this._vx = -this._vx;
    this._vy = -this._vy;
    this._side = -this._side;
    this._pitch -= PI;
    this._z = -this._z;
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
};
