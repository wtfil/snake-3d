var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

var geometry = new THREE.BoxGeometry(2,2,2);
var material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true
});
var cube = new THREE.Mesh( geometry, material );



scene.add( cube );

var R = 4;
camera.position.z = R;
document.body.appendChild( renderer.domElement );


var alpha = 0; teta = 0;
var v = 0.05;
window.addEventListener('keypress', function (e) {
    var code = e.keyCode;
    // 119 w
    // 115 s
    // 97 a
    // 100 d
    if (code === 119) {
        teta += v;
    }
    if (code === 115) {
        teta -= v;
    }
    if (code === 100) {
        alpha += v;
    }
    if (code === 97) {
        alpha -= v;
    }

    camera.position.y = Math.sin(teta) * R;
    camera.position.z = Math.cos(teta) * Math.cos(alpha) * R;
    camera.position.x = Math.cos(teta) * Math.sin(alpha) * R;

    camera.lookAt(new THREE.Vector3(0, 0, 0));
    console.log(e)
});
console.log(camera.position);

;(function renderTick() {
    requestAnimationFrame(renderTick);
    renderer.render(scene, camera);
}());
