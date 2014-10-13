var THREE = require('three');
var height = Math.pow(2, -1/2);

function plane(options) {

    var geometry = new THREE.PlaneGeometry(0.8, 0.8);
    var material = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        color: options.color
    });
    var item = new THREE.Mesh( geometry, material );
    item.position = options.position;
    item.position.x += 0.1;
    item.position.y += 0.1;

    return item;

}

function pyramid(options) {

    var geometry = new THREE.CylinderGeometry(0, height, height, 4);
    var material = new THREE.MeshLambertMaterial({
        color: options.color
    });

    var item = new THREE.Mesh(geometry, material);
    var sing = options.up ? 1 : -1;

    item.position = options.position.clone();
    item.rotation.x = sing * Math.PI / 2;
    item.position.z += sing * (height / 2 + 0.1);
    item.rotation.y = Math.PI / 4;

    return [item, plane({color: 0xFFFF99, position: options.position})];
}

// http://jsfiddle.net/VsWb9/2607/
function head(options) {
    var vertices = [
        [0, 2, 1],
        [0, 1, 2],
        [0, 3, 2],
        [0, 2, 3],
        [1, 2, 0],
        [1, 0, 2],
        [1, 4, 2],
        [1, 2, 4],
        [4, 2, 4]
    ];
    var faces = [
        [0, 1, 2, 3],
        [1, 2, 3, 0],

        [0, 1, 4, 5],
        [1, 4, 5, 0],

        [1, 3, 5, 7],
        [3, 5, 7, 1],

        [2, 3, 6, 7],
        [3, 6, 7, 2],

        [0, 2, 4, 6],
        [2, 4, 6, 0],

        [4, 5, 8],
        [5, 8, 4],

        [5, 7, 8],
        [7, 8, 5],

        [6, 7, 8],
        [7, 8, 6],

        [4, 6, 8],
        [6, 8, 4]
    ];
    var geometry = new THREE.Geometry();
    var l = d = h = 0.25;
    vertices.forEach(function (item) {
        geometry.vertices.push(new THREE.Vector3(item[0] * l, item[1] * d, item[2] * h));
    });
    faces.forEach(function (item) {
        if (item.length === 4) {
            geometry.faces.push(new THREE.Face4(item[0], item[1], item[2], item[4]));
        } else {
            geometry.faces.push(new THREE.Face3(item[0], item[1], item[2]));
        }

    });
    geometry.mergeVertices();

    var material = new THREE.MeshNormalMaterial({
        color: 0xff0000,
        side: THREE.DoubleSide
    });
    //var meterial = new THREE.MeshBasicMaterial({ vertexColors : THREE.VertexColors })
    geometry.faces[0].color.setHex(0xff0000);
    var item = new THREE.Mesh(geometry, material);
    item.position = options.position.clone();
    item.position.z += 0.4;

    return item;
}

function segment(options) {
    var geometry = new THREE.BoxGeometry(1, 0.3, 0.3);
    var material = new THREE.MeshLambertMaterial({
        color: 0xff0000
    });
    var item = new THREE.Mesh(geometry, material);
    item.position = options.position.clone();
    item.position.z += 0.4;

    return item;
}

function light(position) {
    var item = new THREE.DirectionalLight(0xffffff, 1);
    item.position = position;

    return item;
}

module.exports = {
    plane: plane,
    pyramid: pyramid,
    head: head,
    segment: segment,
    light: light
};
