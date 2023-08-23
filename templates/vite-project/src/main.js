import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import * as d3 from "d3"

const get = (get) => document.querySelector(get)














fetch('getInitialOrganismsAndPossibleGeneticMutations')





let genes = {
    'algae': [{property: 'glowing', name: 'asdfasdf'},
			  {property: 'increased photosynthesis', name: 'aslkdfjaslkdfj'},
			  {}
			
			],
    'corn': [{property: 'purple', name: 'asdfasdf'}],
    'trees': [{property: 'purple', name: 'asdfasdf'}],
}


get('.dropdown').innerHTML = Object.keys(genes).map((x) => '<option>' + x + '</option>')
get('.gene-dropdown').innerHTML = genes['algae'].map((x) => '<option>' + x.property + '</option>')

get('.gene-dropdown').addEventListener('change', function () {

     fetch('/findCorrectPlaceToPutGeneInNucleus', {
         ...genes['algae']['glowing']
     }).then(reRenderDNA)


	 fetch('/designSGRNA').then(renderDesignSGRNA)
})

function reRenderDNA() {}
function renderDesignSGRNA() {}

// https://usegalaxy.eu/?tool_id=toolshed.g2.bx.psu.edu%2Frepos%2Fdevteam%2Fdgidb_annotator%2Fdgidb_annotator%2F0.1&version=latest
//https://colab.research.google.com/github/deepmind/alphafold/blob/main/notebooks/AlphaFold.ipynb#scrollTo=XUo6foMQxwS2
let kmers = d3.json('/kmers.json', {
  crossOrigin: "anonymous",
  headers : { 
	//https://github.com/Lattice-Automation/seqviz
//https://medium.com/this-week-in-synthetic-biology/python-meet-synthetic-biology-the-dna-computing-issue-cf46114fa7b1
}}).then (kmers => {
	console.log()
	d3.select('ul.kmers').selectAll('li')
	.data(kmers).join('li').text(data => data)
	.classed('text-ellipsis overflow-hidden ...', true)

	.on('click', function (data) {
		renderTree()

		editGeneSeeHowItAffectsTheOrganism()
	})
}) 
async function getPossibleEdits() {
	let req = await fetch('/tree.json')
	let json = await req.json()
	return json
}

async function getInformationAboutGeneEditing(seq){
	let data = await getPossibleEdits()
  // Specify the charts’ dimensions. The height is variable, depending on the layout.
  const width = 928;
  const marginTop = 10;
  const marginRight = 10;
  const marginBottom = 10;
  const marginLeft = 40;

  // Rows are separated by dx pixels, columns by dy pixels. These names can be counter-intuitive
  // (dx is a height, and dy a width). This because the tree must be viewed with the root at the
  // “bottom”, in the data domain. The width of a column is based on the tree’s height.
  const root = d3.hierarchy(data);
  const dx = 10;
  const dy = (width - marginRight - marginLeft) / (1 + root.height);

  // Define the tree layout and the shape for links.
  const tree = d3.tree().nodeSize([dx, dy]);
  const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);

  // Create the SVG container, a layer for the links and a layer for the nodes.
  const svg = d3.select("svg")
      .attr("width", width)
      .attr("height", dx)
      .attr("viewBox", [-marginLeft, -marginTop, width, dx])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif; user-select: none;");

  const gLink = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

  const gNode = svg.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

  function update(event, source) {
    const duration = event?.altKey ? 2500 : 250; // hold the alt key to slow down the transition
    const nodes = root.descendants().reverse();
    const links = root.links();
    tree(root);

    let left = root;
    let right = root;
    root.eachBefore(node => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
    });

    const height = right.x - left.x + marginTop + marginBottom;

    const transition = svg.transition()
        .duration(duration)
        .attr("height", height)
        .attr("viewBox", [-marginLeft, left.x - marginTop, width, height])
        .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

    // Update the nodes…
    const node = gNode.selectAll("g")
      .data(nodes, d => d.id);

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append("g")
        .attr("transform", d => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", (event, d) => {
          d.children = d.children ? null : d._children;
          update(event, d);
        });

    nodeEnter.append("circle")
        .attr("r", 2.5)
        .attr("fill", d => d._children ? "#555" : "#999")
        .attr("stroke-width", 10);

    nodeEnter.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d._children ? -6 : 6)
        .attr("text-anchor", d => d._children ? "end" : "start")
        .text(d => d.data.name)
      .clone(true).lower()
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .attr("stroke", "white");

    // Transition nodes to their new position.
    const nodeUpdate = node.merge(nodeEnter).transition(transition)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    const nodeExit = node.exit().transition(transition).remove()
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

    // Update the links…
    const link = gLink.selectAll("path")
      .data(links, d => d.target.id);

    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().append("path")
        .attr("d", d => {
          const o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
        });

    // Transition links to their new position.
    link.merge(linkEnter).transition(transition)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition(transition).remove()
        .attr("d", d => {
          const o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        });

    // Stash the old positions for transition.
    root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }
  // Do the first update to the initial configuration of the tree — where a number of nodes
  // are open (arbitrarily selected as the root, plus nodes with 7 letters).
  root.x0 = dy / 2;
  root.y0 = 0;
  root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;
    if (d.depth && d.data.name.length !== 7) d.children = null;
  });

 update(null, root);

  return svg.node();
}







async function editGeneSeeHowItAffectsTheOrganism(gene) {
	//map out how to get glowing plant genes into a tree
	//figure out other workflows
	//figure out workflows in blue biotech - make green algae better for the environment
	//figure out how to design better vaccines and medicines
	//figure out how to present all information there is to know from all single-cell analysis 

	//use 100s of different single-cell analysis studies to simulate different aspects of the cell
	//using the simulation data, present a list of information that describes how the edit may change the entire organism 
	let req = await fetch('http://localhost:5000/gene-editing')
	let json = await req.json()

	get('.possible-edits-to-gene').textContent = JSON.stringify(json, null, 2)
}
const svg = d3.select('svg')
function renderTree() {
	getInformationAboutGeneEditing()
}
//6. ecosystem ? (out of scope)
// fetch('http://localhost:5000/genomics').then(req => req.json).then(json =>renderGenomics(json))
// fetch('http://localhost:5000/transcriptomics').then(req => req.json).then(json => renderTranscriptomics(json))
// fetch('http://localhost:5000/proteomics').then(req => req.json).then(json => renderProteomics(json))
// function renderGenomics(json) {
// 	get('.genomics')
// 	//render the sequences and possible edits to them
// }
// function renderTranscriptomics(json) {
// 	get('.Transcriptomics')
// 	//render a list of changes to the RNA
// }
// function renderProteomics(json) {
// 	let container = get('.proteomics')
// 	for (let i = 0; i < json.length; i++) {
// 	}
// 	//render a list of proteins 
// 	//when you interact with the item, changes propagate across the sequence of views into the cell
// 	//
// }
import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { PDBLoader } from 'three/addons/loaders/PDBLoader.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
let camera, scene, renderer, labelRenderer;
let controls;
let root;
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

	renderer = new THREE.WebGLRenderer( { antialias: true, canvas: document.querySelector('canvas')} );
	renderer.setPixelRatio( window.devicePixelRatio );
	document.querySelector( 'body' ).appendChild( renderer.domElement );

	labelRenderer = new CSS2DRenderer();
	labelRenderer.setSize( window.innerWidth, window.innerHeight );
	labelRenderer.domElement.style.position = 'absolute';
	labelRenderer.domElement.style.top = '0px';
	labelRenderer.domElement.style.pointerEvents = 'none';
	controls = new TrackballControls( camera, renderer.domElement );
	controls.minDistance = 500;
	controls.maxDistance = 2000;
	loadMolecule(  );
	window.addEventListener( 'resize', onWindowResize );
}


function loadMolecule(  ) {
	const url = '/1w5c.pdb';
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
			object.position.multiplyScalar( 10 );
			object.scale.multiplyScalar( 10 );
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

			start.multiplyScalar( .1 );
			end.multiplyScalar( .1 );

			const object = new THREE.Mesh( boxGeometry, new THREE.MeshPhongMaterial( 0xffffff ) );
			object.position.copy( start );
			object.position.lerp( end, 0.5 );
			object.scale.set( 10, 10, start.distanceTo( end ) );
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

	// root.rotation.x = time;
	// root.rotation.y = time * 0.7;

	render();

}

function render() {

	renderer.render( scene, camera );
	labelRenderer.render( scene, camera );

}