var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();

var particles = new THREE.Geometry();

var points;

var material;


function updateParticles(coordinates){
    particles = new THREE.Geometry();
    particles.vertices.length = 0;

    for (var coordinate of coordinates.data) {
        particles.vertices.push(
            new THREE.Vector3(coordinate[0]/65536/6553,
                    coordinate[1]/65536/6553,
                    coordinate[2]/65536/6553)
        );
    }
}

function init(coordinates){
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    updateParticles(coordinates);

    material = new THREE.PointsMaterial( {
        color: 0xaaff55,
        size: 0.001,
        blending: THREE.NormalBlending
    } );
    points = new THREE.Points( particles, material );
    scene.add( points );

    camera.position.z = 30;
}

function update(coordinates) {

    scene.remove(points);
    particles.dispose();
    material.dispose();

    updateParticles(coordinates);

    material = new THREE.PointsMaterial( {
        color: 0xaaff55,
        size: 0.001,
        blending: THREE.NormalBlending
    } );
    points = new THREE.Points( particles, material );
    scene.add( points );

    camera.position.z = 30;
}

function render() {
    requestAnimationFrame( render );
    renderer.render( scene, camera );
}

function initialize(location) {
    Papa.parse(location, {
        download: true,
        complete: function(results) {
            init(results);
            render();
        }
    });
}

/* */
var isDragging = false;
var previousMousePosition = {
    x: 0,
    y: 0
};
$(renderer.domElement).on('mousedown', function(e) {
    isDragging = true;
})
.on('mousemove', function(e) {
    var deltaMove = {
        x: e.offsetX-previousMousePosition.x,
        y: e.offsetY-previousMousePosition.y
    };

    if(isDragging) {

        particles.rotateY(deltaMove.x/10);
        particles.rotateX(deltaMove.y/10)
    }

    previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY
    };
});
/* */

$(document).on('mouseup', function(e) {
    isDragging = false;
});

var devices = [
    'data/brother_coords.csv',
    'data/chromecast_coords.csv',
    'data/cisco_coords.csv',
    'data/synology_coords.csv'
];

var params =  {
    device: devices[0]
};
var gui = new dat.GUI();
var controller = gui.add(params, 'device', devices);
controller.onFinishChange(function(location) {
     Papa.parse(location, {
        download: true,
        complete: function(results) {
            particles.dynamic = true;
            update(results);
            particles.verticesNeedUpdate = true;
        }
    });
});

initialize(devices[0]);