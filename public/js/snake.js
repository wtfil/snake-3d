var THREE = require('three');
var components = require('./levels/components');
var gameLoop = require('./core/game-loop');

var V = 0.05;

function getSign(val) {
    return val && (val > 0 ? 1 : -1);
}

function getRotateAngle(vx, vy) {
    if (vy > 0) {
        return Math.PI / 2;
    } else if (vy < 0) {
        return -Math.PI / 2;
    } else if (vx < 0) {
        return Math.PI;
    } else {
        return 0;
    }
}

function Segment(options) {
    this.object = components[options.componentName]({
        position: options.position,
        size: options.size
    });
    this.size = options.size;
    this.componentName = options.componentName;
    this.position = options.position.clone();
    this.vx = options.vx;
    this.vy = options.vy;
    this.setInitalCoutner();
    this.updateRotation();
}

Segment.prototype.setInitalCoutner = function (options) {
	var d;
	if (this.vx > 0) {
		d = 1 - this.position.x % 1;
	} else if (this.vx < 0) {
		d = this.position.x % 1;
	} else if (this.vy > 0) {
		d = 1 - this.position.y % 1
	} else {
		d = this.position.y % 1
	}
	this.stepsToRotate = ~~(d / V);
};
Segment.prototype.updateRotation = function () {
    var rotateAngle = getRotateAngle(this.vx, this.vy);
    this.object.rotation.z = rotateAngle;
};
Segment.prototype.appendToScene = function (scene) {
    var edges = new THREE.EdgesHelper(this.object, 0xffffff);
    edges.material.linewidth = 2;
    scene.add(this.object);
    scene.add(edges);
};
Segment.prototype.updateSpeed = function (vx, vy) {
    this.vx = vx;
    this.vy = vy;
    this.updateRotation();
}
Segment.prototype.move = function (prev) {
    this.object.position.x += this.vx;
    this.object.position.y += this.vy;
    this.position.x += this.vx;
    this.position.y += this.vy;
    this.stepsToRotate--;
    if (!this.stepsToRotate && prev) {
    	this.stepsToRotate = ~~(1 / V);
		this.updateSpeed(prev.vx, prev.vy);
    }
};
Segment.prototype.addPosition = function (x, y) {
    this.object.position.add({x: x, y: y, z: 0});
    this.position.add({x: x, y: y, z: 0});
    this.setInitalCoutner();
}
Segment.prototype.clone = function () {
	return new Segment({
		componentName: this.componentName,
		position: this.position.clone(),
		size: this.size,
		vx: this.vx,
		vy: this.vy
	});
}

function Snake(options) {
    if (options.length < 2) {
        throw new Error('Snake could not be less then 2 bars lenght');
    }

    this.segments = [];
    this.segmentLength = 0.8;
    this._vx = options.direction.x * V;
    this._vy = options.direction.y * V;
    this._side = 1;
    this._fill(options);
    this.updateHeadCounter();
    gameLoop.add(this._onGameLoop.bind(this));
}

Snake.prototype = Object.create(Array.prototype);

Snake.prototype.getHead = function () {
    return this.segments[0];
};

Snake.prototype.updateHeadCounter = function () {
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

    for (i = this.segments.length - 1; i > 0; i --) {
        curr = this.segments[i];
        prev = this.segments[i - 1];
        curr.move(prev);
    }
    this.segments[0].move();

    this._stepsToRotate --;

    if (!this._stepsToRotate) {
        this.updateHeadCounter();
        this.segments[0].updateSpeed(this._vx, this._vy);
    }

}


Snake.prototype._fill = function(options) {
    var headPosition = new THREE.Vector3(options.position.x, options.position.y, 0);
    var position = headPosition;
    var singX = getSign(this._vx) * this.segmentLength;
    var singY = getSign(this._vy) * this.segmentLength;
    var rotateAngle = getRotateAngle(this._vx, this._vy);
    var segment, line, componentName;
    var i = 0;

    for (; i < options.length; i ++) {
        position = position.clone();

        var segment = new Segment({
            position: position,
			size: this.segmentLength,
            componentName: i === 0 ? 'head' : 'segment',
            vx: this._vx,
            vy: this._vy
        });
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
    var l = this.segmentLength;

    if (segment.vx > 0) {
        segment.addPosition(-l, 0);
    } else if (segment.vx < 0) {
        segment.addPosition(l, 0);
    } else if (segment.vy > 0) {
        segment.addPosition(0, -l);
    } else {
        segment.addPosition(0, l);
    }

    this.segments.push(segment);
    segment.appendToScene(this.scene);
};

Snake.prototype.appendToScene = function(scene) {
    this.scene = scene;
    this.segments.forEach(function (segment) {
        segment.appendToScene(scene);
    });
};

module.exports = function (options) {
    return new Snake(options);
};
