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
camera.position.z = 400;

var scene = new THREE.Scene();
scene.add(camera);

camera.position.z = 100;
camera.position.x = 50;
camera.position.y = 50;
//camera.rotation.y = 90;


//var light = new THREE.Light();
// var light = new THREE.DirectionalLight();
// scene.add(light);



var light = new THREE.AmbientLight();
var intensity = 0.025;
scene.add(light);
light.color.setRGB( 20 * intensity, 0 * intensity, 255 * intensity );

//var light = new THREE.PointLight(0xffffff, 1, 150);
//light.position.set( 0, 0, 10 );

//var light = new THREE.AreaLight();
//var light = new THREE.SpotLight();
//light.castShadow = true;

//light.position.z = 10;
//light.position.y = 200;
// scene.add(light);

// var spotLightHelper = new THREE.SpotLightHelper(light);
// // scene.add(spotLightHelper);
// var directionalHelper = new THREE.DirectionalLightHelper(light);
// scene.add(directionalHelper);

var lightDebug = new THREE.Mesh(new THREE.SphereGeometry(5), new THREE.MeshBasicMaterial());
lightDebug.position = light.position;
scene.add(lightDebug);


var material = new THREE.MeshLambertMaterial(
{
  color: 0xFF0000
});


var radius = 5,
    segments = 50,
    rings = 50;

var spheres = [];
for (var x = 0; x < 5; x++)  {
  spheres[x] = [];
  for (var y = 0; y < 5; y++)  {
    spheres[x][y] = [];
    for (var z = 0; z < 5; z++)  {
      spheres[x][y][z] = new THREE.Mesh(new THREE.SphereGeometry(
            radius,
            segments,
            rings), material);
      spheres[x][y][z].position.x = x * (radius ^ 2) * radius;
      spheres[x][y][z].position.y = y * (radius ^ 2) * radius;
      spheres[x][y][z].position.z = z * (radius ^ 2) * radius;
      scene.add(spheres[x][y][z]);
    }
  }
}

var cameraHelper = new THREE.CameraHelper(camera);
scene.add(cameraHelper);



function logic()  {
  // spotLightHelper.update();
	requestAnimationFrame(render);
}

function render() {
  renderer.render(scene, camera);
}

setInterval(logic, 1000/60);
