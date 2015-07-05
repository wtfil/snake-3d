var THREE = require('three');
var components = require('./levels/components');
var gameLoop = require('./core/game-loop');

var V = 0.05;

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

    this.segments = [];
    this._vx = options.direction.x * V;
    this._vy = options.direction.y * V;
    this._side = 1;
    this._fill(options);
    this._updateCounters();
    gameLoop.add(this._onGameLoop.bind(this));
}

Snake.prototype = Object.create(Array.prototype);

Snake.prototype.getHead = function () {
    return this.segments[0];
};

Snake.prototype._updateCounters = function () {
    // TODO  next rotate does works properly, needs to be fixed
    if (this.nextRotate === 'left') {
        this.turnLeft();
    } else if (this.nextRotate === 'right') {
        this.turnRight();
    }
    this.nextRotate = null;
    this.currentRoute = null;
    this._stepsToRotate = ~~(1 / V);
};

Snake.prototype._onGameLoop = function () {
    var i = this.length - 1;
    var prevAngle, angle;
    var curr, prev;

    for (i = 0; i < this.segments.length; i ++) {
        curr = this.segments[i];
        curr.position.x += curr.vx;
        curr.position.y += curr.vy;
    }

    this._stepsToRotate --;

    if (!this._stepsToRotate) {

        this._updateCounters();

        for (i = this.segments.length - 1; i > 0; i --) {
            curr = this.segments[i];
            prev = this.segments[i - 1];
            curr.vx = prev.vx;
            curr.vy = prev.vy;
            curr.rotation.z = getRotateAngle(curr.vx, curr.vy);
        }
        curr = this.segments[0];

        curr.vx = this._vx;
        curr.vy = this._vy;
        curr.rotation.z = getRotateAngle(curr.vx, curr.vy);

    }

}


Snake.prototype._fill = function(options) {
    var headPosition = new THREE.Vector3(options.position.x, options.position.y, 0);
    var position = headPosition;
    var singX = getSign(this._vx);
    var singY = getSign(this._vy);
    var rotateAngle = getRotateAngle(this._vx, this._vy);
    var i = 0;
    var segment;

    for (; i < options.length; i ++) {
        position = position.clone();

        segment = components.segment({position: position, color: 0xffffff});
        segment.vx = this._vx;
        segment.vy = this._vy;
        segment.rotation.z = rotateAngle;
        this.segments.push(segment);

        position.x -= singX;
        position.y -= singY;
    }
};

Snake.prototype.turnLeft = function () {

    if (this.currentRoute) {
        this.nextRotate = 'left';
        return;
    }
    this.currentRoute = 'left';
    if (this._vy !== 0) {
        this._vx = -this._vy * this._side;
        this._vy = 0;
    } else {
        this._vy = this._vx * this._side;
        this._vx = 0;
    }

};

Snake.prototype.turnRight = function () {

    if (this.currentRoute) {
        this.nextRotate = 'right';
        return;
    }
    this.currentRoute = 'right';
    if (this._vy !== 0) {
        this._vx = this._vy * this._side;
        this._vy = 0;
    } else {
        this._vy = -this._vx * this._side;
        this._vx = 0;
    }

};

Snake.prototype.extend = function () {
    var last = this.segments.slice().pop();
    var segment = last.clone();

    segment.vx = last.vx;
    segment.vy = last.vy;

    if (segment.vx > 0) {
        segment.position.x --;
    } else if (segment.vx < 0) {
        segment.position.x ++;
    } else if (segment.vy > 0) {
        segment.position.y --;
    } else {
        segment.position.y ++;
    }

    this.segments.push(segment);
    this.scene.add(segment);
};

Snake.prototype.appendToScene = function(scene) {
    this.scene = scene;
    this.segments.forEach(function (item) {
        scene.add(item);
    });
};

module.exports = function (options) {
    return new Snake(options);
};
