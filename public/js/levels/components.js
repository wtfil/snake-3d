var THREE = require('three');

function line(options) {

}

function plane(options) {

    var geometry = new THREE.PlaneGeometry(1, 1);
    var material = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        color: options.color
    });
    var item = new THREE.Mesh( geometry, material );
    item.position = options.position;

    return item;

}

function cube(options) {

    var geometry = new THREE.CylinderGeometry(0, 0.4, 0.5, 4);
    var material = new THREE.MeshLambertMaterial({
        color: options.color
    });

    var item = new THREE.Mesh(geometry, material);
    var sing = options.up ? 1 : -1;

    item.position = options.position.clone();
    item.rotation.x = sing * Math.PI / 2;
    item.position.z += sing * 0.26;

    return [item, plane({color: 0xFFFF99, position: options.position})];
}

function light(position) {
    var item = new THREE.DirectionalLight(0xffffff, 1);
    item.position = position;

    return item;
}

module.exports = {
    plane: plane,
    cube: cube,
    light: light
};
