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
    var item, i, j, point;

    for (i = 0; i < my; i ++) {
        for (j = 0; j < mx; j ++) {

            point = map[i][j];

            if (point === 1) {

                item = components.plane({
                    color: 0xFFFF99,
                    position: new THREE.Vector3(j, i, 0)
                });

            } else if (point === 2) {

                item = components.cube({
                    color: 0xCC66FF,
                    position: new THREE.Vector3(j, i, 0)
                });

            } else if (point === 3) {

                item = components.cube({
                    color: 0x00CCFF,
                    position: new THREE.Vector3(j, i, -1)
                });

            } else {
                throw new Error('point with value "' + point +'" does not supported');
            }
            scene.add(item);
        }
    }

    return scene;
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
