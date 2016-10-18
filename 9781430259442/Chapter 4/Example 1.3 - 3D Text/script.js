var width  = window.innerWidth,
height = window.innerHeight;

var container = document.querySelector('#container');

var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

var VIEW_ANGLE = 45,
    NEAR = 0.1,
    FAR = 10000;
var camera =  new THREE.PerspectiveCamera(45, width / height, 1, 1000);
camera.position.z = 300;

var scene = new THREE.Scene();
scene.add(camera);

var directionalLight = new THREE.DirectionalLight();
directionalLight.position.z = 10;
scene.add(directionalLight);

var material = new THREE.MeshLambertMaterial(
{
  color: 0xFF0000
});

var text = new THREE.Mesh(new THREE.TextGeometry("Hello World!", {}), material);
scene.add(text);

function logic()  {
	text.rotation.y += 0.005;
	text.rotation.x += 0.005;
	requestAnimationFrame(render);
}

function render() {
  renderer.render(scene, camera);
}

setInterval(logic, 1000/60);