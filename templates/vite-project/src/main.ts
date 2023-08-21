import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'


//viewers








import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import _, { map } from 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.13.6/underscore-esm-min.js';
   
let kmers = await d3.json('/mock.json', {
  crossOrigin: "anonymous",
  headers : { 

}})

d3.select('ul.kmers').selectAll('li').data(kmers.kmers).join('li').text(data => data)
.on('click', function (data) {
	renderTree(data)
})
const svg = d3.select('svg')

function renderTree() {
	
	svg.append('circle').attr('cx', Math.random() * 500)
	.attr('cy', Math.random() * 500)
	.attr('r', 10).attr('fill', 'blue')

	svg.append('line').attr('x1', 0)
	.attr('y1', 0).attr('y2', 0).attr('x2', 0)
}
//visualize how editing one gene affects the cell
//see how the changes in the cell affect the tisues
//see how the changes in the tissue affects the organism
//see how the changes in the organism changes the enviroment - woth a picture of a glowing tree or an algae that produces extra biofuel or other improvements
// how many charts can you make for this progress that look cool and render instantly 
//1. genomics - dna
//2. transcriptomics - ribosome
//3. proteinomics - protein
//4. metalabolimcs - sugars and sodium 
//5. RNA sg-guide ???
//help run experiments so biologists in the lab dont have to - do it with simulation and verify in the lab 
//will changing it like this cause unseen perturbations? (alert) -> if not, then it is a good idea.... .... .. .


//6. ecosystem ? (out of scope)
//design algorithm along with the output (wysiwyg)


fetch('http://localhost:5000/genomics').then(req => req.json).then(json =>renderGenomics(json))
fetch('http://localhost:5000/transcriptomics').then(req => req.json).then(json => renderTranscriptomics(json))
fetch('http://localhost:5000/proteomics').then(req => req.json).then(json => renderProteomics(json))

function renderGenomics(json) {
	get('.genomics')
	//render the sequences and possible edits to them
}
function renderTranscriptomics(json) {
	get('.Transcriptomics')
	//render a list of changes to the RNA
}
function renderProteomics(json) {
	let container = get('.proteomics')
	for (let i = 0; i < json.length; i++) {

	}
	//render a list of proteins 
	//when you interact with the item, changes propagate across the sequence of views into the cell
	//
}

const get = (get) => document.querySelector(get)
//https://www.shadertoy.com/view/tlGGz1
//algae from scratch ??? https://algaeliving.com/2020/03/24/interesting-facts-about-algae/ 

//dna assembly
//alignment
//develop artifical construct

//transcriptome





import * as THREE from 'three';

import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { PDBLoader } from 'three/addons/loaders/PDBLoader.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

let camera, scene, renderer, labelRenderer;
let controls;

let root;


const params = {
	molecule: 'caffeine.pdb'
};

const loader = new PDBLoader();
const offset = new THREE.Vector3();

init();
animate();

function init() {

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x050505 );

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 5000 );
	camera.position.z = 1000;
	scene.add( camera );

	const light1 = new THREE.DirectionalLight( 0xffffff, 2.5 );
	light1.position.set( 1, 1, 1 );
	scene.add( light1 );

	const light2 = new THREE.DirectionalLight( 0xffffff, 1.5 );
	light2.position.set( - 1, - 1, 1 );
	scene.add( light2 );

	root = new THREE.Group();
	scene.add( root );

	//

	renderer = new THREE.WebGLRenderer( { antialias: true, canvas: document.querySelector('canvas')} );
	renderer.setPixelRatio( window.devicePixelRatio );
	//renderer.setSize( window.innerWidth, window.innerHeight );
	document.querySelector( 'body' ).appendChild( renderer.domElement );

	labelRenderer = new CSS2DRenderer();
	labelRenderer.setSize( window.innerWidth, window.innerHeight );
	labelRenderer.domElement.style.position = 'absolute';
	labelRenderer.domElement.style.top = '0px';
	labelRenderer.domElement.style.pointerEvents = 'none';
	//document.getElementById( 'container' ).appendChild( labelRenderer.domElement );

	//

	controls = new TrackballControls( camera, renderer.domElement );
	controls.minDistance = 500;
	controls.maxDistance = 2000;

	//

	loadMolecule( params.molecule );

	//

	window.addEventListener( 'resize', onWindowResize );

	//

}

//

function loadMolecule( model ) {

	const url = '/graphite.pdb';

	while ( root.children.length > 0 ) {

		const object = root.children[ 0 ];
		object.parent.remove( object );

	}

	loader.load( url, function ( pdb ) {

		const geometryAtoms = pdb.geometryAtoms;
		const geometryBonds = pdb.geometryBonds;
		const json = pdb.json;

		const boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
		const sphereGeometry = new THREE.IcosahedronGeometry( 1, 3 );

		geometryAtoms.computeBoundingBox();
		geometryAtoms.boundingBox.getCenter( offset ).negate();

		geometryAtoms.translate( offset.x, offset.y, offset.z );
		geometryBonds.translate( offset.x, offset.y, offset.z );

		let positions = geometryAtoms.getAttribute( 'position' );
		const colors = geometryAtoms.getAttribute( 'color' );

		const position = new THREE.Vector3();
		const color = new THREE.Color();

		for ( let i = 0; i < positions.count; i ++ ) {

			position.x = positions.getX( i );
			position.y = positions.getY( i );
			position.z = positions.getZ( i );

			color.r = colors.getX( i );
			color.g = colors.getY( i );
			color.b = colors.getZ( i );

			const material = new THREE.MeshPhongMaterial( { color: color } );

			const object = new THREE.Mesh( sphereGeometry, material );
			object.position.copy( position );
			object.position.multiplyScalar( 75 );
			object.scale.multiplyScalar( 25 );
			root.add( object );

			const atom = json.atoms[ i ];

			const text = document.createElement( 'div' );
			text.className = 'label';
			text.style.color = 'rgb(' + atom[ 3 ][ 0 ] + ',' + atom[ 3 ][ 1 ] + ',' + atom[ 3 ][ 2 ] + ')';
			text.textContent = atom[ 4 ];

			const label = new CSS2DObject( text );
			label.position.copy( object.position );
			root.add( label );

		}

		positions = geometryBonds.getAttribute( 'position' );

		const start = new THREE.Vector3();
		const end = new THREE.Vector3();

		for ( let i = 0; i < positions.count; i += 2 ) {

			start.x = positions.getX( i );
			start.y = positions.getY( i );
			start.z = positions.getZ( i );

			end.x = positions.getX( i + 1 );
			end.y = positions.getY( i + 1 );
			end.z = positions.getZ( i + 1 );

			start.multiplyScalar( 75 );
			end.multiplyScalar( 75 );

			const object = new THREE.Mesh( boxGeometry, new THREE.MeshPhongMaterial( 0xffffff ) );
			object.position.copy( start );
			object.position.lerp( end, 0.5 );
			object.scale.set( 5, 5, start.distanceTo( end ) );
			object.lookAt( end );
			root.add( object );

		}

		render();

	} );

}

//

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	//renderer.setSize( window.innerWidth, window.innerHeight );
	labelRenderer.setSize( window.innerWidth, window.innerHeight );

	render();

}

function animate() {

	requestAnimationFrame( animate );
	controls.update();

	const time = Date.now() * 0.0004;

	root.rotation.x = time;
	root.rotation.y = time * 0.7;

	render();

}

function render() {

	renderer.render( scene, camera );
	labelRenderer.render( scene, camera );

}