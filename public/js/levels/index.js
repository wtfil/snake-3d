var THREE = require('three');
var resolve = require('./resolve');
var components = require('./components');

function Level(map) {
    THREE.Scene.call(this);
    this.walls = [];
    this.drawMap(map);
}

Level.prototype = Object.create(THREE.Scene.prototype);

// 1 - plane
// 2 - cube
// 3 - -cube
Level.prototype.drawMap = function (map) {
    var mx = map[0].length;
    var my = map.length;
    var items, i, j, point;

    for (i = 0; i < my; i ++) {
        for (j = 0; j < mx; j ++) {

            point = map[i][j];

            if (point === 1) {

                items = components.plane({
                    color: 0xFFFF99,
                    position: new THREE.Vector3(j, i, 0)
                });

            } else if (point === 2) {

                items = components.pyramid({
                    color: 0xCC66FF,
                    up: true,
                    position: new THREE.Vector3(j, i, 0)
                });
                this.walls.push(items[0]);

            } else if (point === 3) {

                items = components.pyramid({
                    color: 0x00CCFF,
                    up: false,
                    position: new THREE.Vector3(j, i, 0)
                });

            } else {
                throw new Error('point with value "' + point +'" does not supported');
            }

            applyToScene(this, items);
        }
    }

    this.add(new THREE.AmbientLight( 0x212223));
    this.add(components.light(new THREE.Vector3(0, 0, 1)));
    this.add(components.light(new THREE.Vector3(5, 5, -1)));

    return this;
}

function applyToScene(scene, items) {
	items = Array.isArray(items) ? items : [items];
	items.forEach(scene.add.bind(scene));
}

function stringToMap(level) {
    return level.split('\n').filter(Boolean).map(function (line) {
        return line.split(/(.)/).filter(Boolean).map(Number);
    });
}

function getLevel(name) {
    var level = resolve(name);
    var map = level instanceof Object ? level : stringToMap(level);
    return new Level(map);
}

module.exports = {
    get: getLevel
};
