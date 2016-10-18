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
camera.position.z = 200;

var ambient = new THREE.AmbientLight( 0x050505, 2 );
directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set( 2, 1.2, 10 ).normalize();

var scene = new THREE.Scene();
scene.add(ambient);
scene.add(directionalLight);
scene.add(camera);

var amount_nodes = 20;

var Node = function() {
	name = "Random Node",
	position = new THREE.Vector3();

	function getEdges() {
		return [Math.floor(Math.random()*amount_nodes), Math.floor(Math.random()*amount_nodes) ];
	}
	
	return {
		name: name,
		edges: getEdges()
	}
}

var nodes = [];
drawGraph();
function drawGraph()  {
	// Draw nodes
	for (var i = 0; i < amount_nodes; i++)  {
		nodes[i] = new Node();
		drawNode(nodes[i]);
	}

	// Draw edges, has to be done once we have the nodes in place
	for (var i = 0; i < amount_nodes; i++)  {
		drawEdges(nodes[i]);
	}
}

function drawNode(n)  {
	var radius = 10,
	    segments = 50,
	    rings = 50;

    var node = new THREE.Mesh(
	    new THREE.SphereGeometry(
	        radius,
	        segments,
	        rings),
	    new THREE.MeshLambertMaterial( {  color: Math.random() * 0xffffff } ) );

    var area = 300;
    node.position.x = Math.floor(Math.random() * (area * 2 + 1) - area);
    node.position.y = Math.floor(Math.random() * (area * 2 + 1) - area);
    node.position.z = Math.floor(Math.random() * (area * 2 + 1) - area);
    
    n.position = node.position;
    scene.add(node);
}

function drawEdges(node)  {
	var line_material = new THREE.LineBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.1, linewidth:0.5 } );

	for (var i = 0; i < node.edges.length; i++)  {
		var tmp_geo = new THREE.Geometry();
	    tmp_geo.vertices.push(node.position);
	    tmp_geo.vertices.push(nodes[node.edges[i]].position);

	    var line = new THREE.Line( tmp_geo, line_material );
		scene.add(line);
	}
}

function logic()  {
	camera.rotation.x += 0.005;
	camera.rotation.y += 0.005;
	camera.rotation.z += 0.005;
	requestAnimationFrame(render);
}

function render() {
  renderer.render(scene, camera);
}

setInterval(logic, 1000/60);