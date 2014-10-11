var THREE = require('three');
var resolve = require('./resolve');
var components = require('./components');

// 1 - plane
// 2 - cube
// 3 - -cube
function mapToGeometry(map) {
    var scene = new THREE.Scene();
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

            } else if (point === 3) {

                items = components.pyramid({
                    color: 0x00CCFF,
                    up: false,
                    position: new THREE.Vector3(j, i, 0)
                });

            } else {
                throw new Error('point with value "' + point +'" does not supported');
            }

            applyToScene(scene, items);
        }
    }

    scene.add(new THREE.AmbientLight( 0x212223));
    scene.add(components.light(new THREE.Vector3(0, 0, 1)));
    scene.add(components.light(new THREE.Vector3(5, 5, -1)));

    return scene;
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

function random(size) {
    var map = [];
    var i, j;
    for (i = 0; i < size; i ++) {
        map[i] = [];
        for (j = 0; j < size; j ++) {
            map[i][j] = Math.random() > 0.5 ? 1 : 0;
        }
    }
    return mapToGeometry(map);
}

function getLevel(name) {
    var level = resolve(name);
    var map = level instanceof Object ? level : stringToMap(level);
    return mapToGeometry(map);
}

module.exports = {
    random: random,
    get: getLevel
};
