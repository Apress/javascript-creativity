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

var ambient = new THREE.AmbientLight( 0x050505, 2 );
directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set( 2, 1.2, 10 ).normalize();

var scene = new THREE.Scene();
scene.add(ambient);
scene.add(directionalLight);
scene.add(camera);


var radius = 10,
    segments = 50,
    rings = 50;

var Node = function() {
    name = "Random Node",
    position = new  THREE.Vector3(),
    films = [],
    edges = []

    return {
        name: name,
        edges: edges
    }
}

var nodes = [];

drawGraph();
function drawGraph()  {
    var people = data["People"];
    var films = data["Films"];
    for (var i = 0; i < people.length; i++)  {
        nodes[i] = new Node();
        nodes[i].name = people[i].Name;
        nodes[i].films = people[i].Films;
        drawNode(nodes[i]);
    }

    for (var i = 0; i < films.length; i++)  {
        var cast = films[i]["Cast"];
        console.log(cast);
        if (cast.length > 1)  {
            for (var j = 1; j < cast.length; j++)  {
                if (nodes[cast[j-1]].edges.indexOf(cast[j]) == -1)  {
                    console.log(j)
                    console.log(nodes[cast[j-1]]);
                    nodes[cast[j-1]].edges.push(cast[j]);
                }
            }
        }
    }

    for (var i = 0; i < nodes.length; i++)  {
        drawEdges(nodes[i]);
    }
}


function drawNode(node)  {
    var material = new THREE.MeshLambertMaterial( {  color: Math.random() * 0xffffff } );
    var draw_object = new THREE.Mesh(
        new THREE.SphereGeometry(
            radius,
            segments,
            rings),
        material);

    var area = 150;
    draw_object.position.x = Math.floor(Math.random() * (area + area + 1) - area);
    draw_object.position.y = Math.floor(Math.random() * (area + area + 1) - area);
    draw_object.position.z = Math.floor(Math.random() * (area + area + 1) - area);
    node.position = draw_object.position;
    scene.add(draw_object);

    var text_object = new THREE.Mesh(new THREE.TextGeometry(node.name, { size : 10, height: 10}), material);
    text_object.position.x = draw_object.position.x;
    text_object.position.y = draw_object.position.y;
    text_object.position.z = draw_object.position.z;
    scene.add(text_object);

}

function drawEdges(node)  {
    var line_material = new THREE.LineBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.4, linewidth:0.5 } );

    for (var i = 0; i < node.edges.length; i++)  {
        if (node.edges[i] > i)  {
            var tmp_geo = new THREE.Geometry();
            tmp_geo.vertices.push(node.position);
            tmp_geo.vertices.push(nodes[node.edges[i]].position);

            var line = new THREE.Line( tmp_geo, line_material );
            scene.add(line);
        }
    }
}

function logic()  {
    requestAnimationFrame(render);
}

function render() {
  renderer.render(scene, camera);
}

setInterval(logic, 1000/60);
