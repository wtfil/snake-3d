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

function segment(options) {
    var geometry = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 5);
    var material = new THREE.MeshLambertMaterial({
        color: 0xff0000
    });
    var item = new THREE.Mesh(geometry, material);
    item.position = options.position.clone();
    item.position.z += 0.3;
    item.position.y += 0.1;
    //item.position.y += 0.3;
    item.rotation.z = Math.PI / 2;
    //item.rotation.x = Math.PI / 4;

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
    segment: segment,
    light: light
};
