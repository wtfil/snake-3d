var THREE = require('three');

function mapToGeometry(map) {
    var scene = new THREE.Scene();
    var mx = map[0].length;
    var my = map.length;
    var geometry, mesh, meterial, i, j;

    for (i = 0; i < my; i ++) {
        for (j = 0; j < mx; j ++) {

            geometry = new THREE.PlaneGeometry(1, 1);
            material = new THREE.MeshBasicMaterial({
                color: map[i][j] ? 0xff0000 : 0x00ff00
            });
            plane = new THREE.Mesh( geometry, material );
            plane.position.x = j - my / 2;
            plane.position.y = i - mx / 2;
            scene.add(plane);

        }
    }

    return scene;
};

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

module.exports = {
    random: random
};
