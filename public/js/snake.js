var THREE = require('three');
var components = require('./levels/components');
var gameLoop = require('./core/game-loop');

function getSign(val) {
    return val && (val > 0 ? 1 : -1);
}

function getRotateAngle(vx, vy) {
    if (vx > 0) {
        return Math.PI / 2;
    } else if (vx < 0) {
        return -Math.PI / 2;
    } else if (vy > 0) {
        return Math.PI
    } else {
        return 0;
    }
}

function Snake(options) {
    if (options.length < 2) {
        throw new Error('Snake could not be less then 2 bars lenght');
    }
    Array.call(this);

    this.length = options.length;
    this._vx = options.vx;
    this._vy = options.vy;
    this._v = Math.abs(this._vx) + Math.abs(this._vy);
    this._stepsToRotate = ~~(1 / this._v);
    this._side = 1;
    this._fill(options);
    gameLoop.add(this._onGameLoop.bind(this));
}

Snake.prototype = Object.create(Array.prototype);

Snake.prototype._onGameLoop = function () {
    var i = this.length - 1;
    var curr, prev;

    for (i = 0; i < this.length; i ++) {
        curr = this[i];
        curr.position.x += curr.vx;
        curr.position.y += curr.vy;
    }

    this._stepsToRotate --;

    if (!this._stepsToRotate) {

        this._stepsToRotate = ~~(1 / this._v);

        for (i = this.length - 1; i > 0; i --) {
            this[i].vx = this[i - 1].vx;
            this[i].vy = this[i - 1].vy;

            this[i].rotation.z = getRotateAngle(this[i].vx, this[i].vy);
        }

        this[0].vx = this._vx;
        this[0].vy = this._vy;
        this[0].rotation.z = getRotateAngle(this[0].vx, this[0].vy);

    }

}


Snake.prototype._fill = function(options) {
    var headPosition = new THREE.Vector3(options.position[0], options.position[1], 0);
    var position = headPosition;
    var singX = getSign(this._vx);
    var singY = getSign(this._vy);
    var rotateAngle = getRotateAngle(this._vx, this._vy);
    var i = 0;

    for (; i < this.length; i ++) {
        position = position.clone();
        this[i] = components.segment({position: position, color: 0xffffff});
        this[i].vx = this._vx;
        this[i].vy = this._vy;
        this[i].rotation.z = rotateAngle;
        position.x -= singX;
        position.y -= singY;
    }
};

Snake.prototype.turnLeft = function () {

    if (this._vy !== 0) {
        this._vx = -this._vy * this._side;
        this._vy = 0;
    } else {
        this._vy = this._vx * this._side;
        this._vx = 0;
    }

};

Snake.prototype.turnRight = function () {

    if (this._vy !== 0) {
        this._vx = this._vy * this._side;
        this._vy = 0;
    } else {
        this._vy = -this._vx * this._side;
        this._vx = 0;
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
