var THREE = require('three');
var height = Math.pow(2, -1/2);

function plane(options) {

    var geometry = new THREE.PlaneGeometry(0.9, 0.9);
    var material = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        color: 0x66FFFF
    });
    var item = new THREE.Mesh( geometry, material );
    item.position = options.position;
    item.position.x += 0.05;
    item.position.y += 0.05;

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

    return [item, plane({color: 0x66FFFF, position: options.position})];
}

function segment(options) {
    var geometry = new THREE.Geometry();
    var material = new THREE.MeshLambertMaterial({
        color: 0xff0000,
        wireframe: true,
    });
    var H = 0.2, P = 0.2, S = 1;
    function push(x, y, z) {
        geometry.vertices.push(new THREE.Vector3(x, y, z));
    }
    function fase(a, b, c, color) {
        color = color && new THREE.Color(color);
        geometry.faces.push(new THREE.Face3(a, b, c, null, color));
    }
    push(0, P + 0, 0)
    push(0, S / 2, H)
    push(0, S - P, 0)
    push(1, P + 0, 0)
    push(1, S / 2, H)
    push(1, S - P, 0)

    fase(0, 1, 2)
    fase(0, 1, 3)
    fase(0, 1, 4)
    fase(3, 4, 5)
    fase(1, 2, 4)
    fase(1, 2, 5)

    geometry.computeBoundingSphere();
    THREE.GeometryUtils.center(geometry);
    var item = new THREE.Mesh(geometry, material);
    item.position = options.position.clone()
        .add({x: 0, y: 0, z: H / 2});
    return item;
}

function head(options) {
    var geometry = new THREE.Geometry();
    var material = new THREE.MeshLambertMaterial({
        color: 0xff0000,
        wireframe: true
    });
    var H = 0.2, P = 0.1, S = 1;
    function push(x, y, z) {
        geometry.vertices.push(new THREE.Vector3(x, y, z));
    }
    function fase(a, b, c, color) {
        color = color && new THREE.Color(color);
        geometry.faces.push(new THREE.Face3(a, b, c, null, color));
    }
    push(0, 0.2, 0)
    push(0, 0.5, 0.2)
    push(0, 0.8, 0)
    push(0.5, 0.1, 0)
    push(0.5, 0.5, 0.3)
    push(0.5, 0.9, 0)
    push(1, 0.5, 0)

    fase(0, 1, 2)
    fase(0, 1, 3)
    fase(0, 1, 4)
    fase(1, 2, 4)
    fase(1, 2, 5)
    fase(3, 4, 6)
    fase(4, 5, 6)

    geometry.computeBoundingSphere();
    THREE.GeometryUtils.center(geometry);
    var item = new THREE.Mesh(geometry, material);
    item.position = options.position.clone()
        .add({x: 0, y: 0, z: 0.15});
    return item;
}

function coin(options) {
    var geometry = new THREE.CylinderGeometry(0.35, 0.35, 0.1, 20);
    var material = new THREE.MeshLambertMaterial({
        color: 0xE6B800
    });
    var item = new THREE.Mesh(geometry, material);

    item.position = options.position;
    item.position.z += 0.5;
    item.rotation.z = Math.PI / 5;

    return item;
}

function light(position) {
    var item = new THREE.DirectionalLight(0xffffff, 1);
    item.position = position;
    return item;
}

module.exports = {
    head: head,
    plane: plane,
    coin: coin,
    pyramid: pyramid,
    segment: segment,
    light: light
};
