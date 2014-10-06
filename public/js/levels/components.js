var THREE = require('three');

function plane(options) {

    var geometry = new THREE.PlaneGeometry(1, 1);
    var material = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        color: options.color
    });
    var plane = new THREE.Mesh( geometry, material );
    plane.position = options.position;

    return plane;

}

function cube(options) {

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({
        color: options.color,
    });
    
    var cube = new THREE.Mesh(geometry, material);
    cube.position = options.position;
    cube.position.z += 0.5;

    return cube;
}

module.exports = {
    plane: plane,
    cube: cube
};
