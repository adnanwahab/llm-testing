

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import * as dat from 'lil-gui'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture.js';
import getusermedia from 'getusermedia'

import { MeshLineGeometry, MeshLineMaterial, raycast } from 'meshline'

window.voiceBuffer = []

function merge(...args) {
    console.log(args)
}
const railWay = merge(
    //scene1
    1,2,3
    //winding from
)

const vertexShader = /* glsl */ `
  #include <common>
  #include <logdepthbuf_pars_vertex>
  #include <fog_pars_vertex>

  attribute vec3 previous;
  attribute vec3 next;
  attribute float side;
  attribute float width;
  attribute float counters;
  
  uniform vec2 resolution;
  uniform float lineWidth;
  uniform vec3 color;
  uniform float opacity;
  uniform float sizeAttenuation;
  
  varying vec2 vUV;
  varying vec4 vColor;
  varying float vCounters;
  
  vec2 fix(vec4 i, float aspect) {
    vec2 res = i.xy / i.w;
    res.x *= aspect;
  	vCounters = counters;
    return res;
  }
  
  void main() {
    float aspect = resolution.x / resolution.y;
    vColor = vec4(color, opacity);
    vUV = uv;
  
    mat4 m = projectionMatrix * modelViewMatrix;
    vec4 finalPosition = m * vec4(position, 1.0);
    vec4 prevPos = m * vec4(previous, 1.0);
    vec4 nextPos = m * vec4(next, 1.0);
  
    vec2 currentP = fix(finalPosition, aspect);
    vec2 prevP = fix(prevPos, aspect);
    vec2 nextP = fix(nextPos, aspect);
  
    float w = lineWidth * width;
  
    vec2 dir;
    if (nextP == currentP) dir = normalize(currentP - prevP);
    else if (prevP == currentP) dir = normalize(nextP - currentP);
    else {
      vec2 dir1 = normalize(currentP - prevP);
      vec2 dir2 = normalize(nextP - currentP);
      dir = normalize(dir1 + dir2);
  
      vec2 perp = vec2(-dir1.y, dir1.x);
      vec2 miter = vec2(-dir.y, dir.x);
      //w = clamp(w / dot(miter, perp), 0., 4. * lineWidth * width);
    }
  
    //vec2 normal = (cross(vec3(dir, 0.), vec3(0., 0., 1.))).xy;
    vec4 normal = vec4(-dir.y, dir.x, 0., 1.);
    normal.xy *= .5 * w;
    //normal *= projectionMatrix;
    if (sizeAttenuation == 0.) {
      normal.xy *= finalPosition.w;
      normal.xy /= (vec4(resolution, 0., 1.) * projectionMatrix).xy;
    }
  
    finalPosition.xy += normal.xy * side;
    gl_Position = finalPosition;
    #include <logdepthbuf_vertex>
    #include <fog_vertex>
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    #include <fog_vertex>
  }
`


    const fs = (i) => `
    #include <fog_pars_fragment>
    #include <logdepthbuf_pars_fragment>
    
    uniform sampler2D map;
    uniform sampler2D alphaMap;
    uniform float useMap;
    uniform float useAlphaMap;
    uniform float useDash;
    uniform float dashArray;
    uniform float dashOffset;
    uniform float dashRatio;
    uniform float visibility;
    uniform float alphaTest;
    uniform vec2 repeat;
    
    uniform float time;
    
    varying vec2 vUV;
    varying vec4 vColor;
    varying float vCounters;
    
    void main() {
      float index = ${i}.;
      #include <logdepthbuf_fragment>
      vec4 c = vColor;
      if (useMap == 1.) c *= texture2D(map, vUV * repeat);
      if (useAlphaMap == 1.) c.a *= texture2D(alphaMap, vUV * repeat).a;
      if (c.a < alphaTest) discard;
      if (true) {
        c.a *= ceil(mod(vCounters + dashOffset, dashArray) - (dashArray * dashRatio));
      }
      gl_FragColor = c;
      //gl_FragColor.r = sin(time * .010) * .01;
      gl_FragColor.a *= step(vCounters, visibility);
      //gl_FragColor.a = sin(time * .010) * .1;
      //if (vCounters > time) { discard;}
      #include <fog_fragment>
      #include <tonemapping_fragment>
      #include <encodings_fragment>
    }
    `;

//when you turn on the lights -> bear -> hawk 
//turns into something else when you get closer to it
//find a shiny spaceship flying saucer model and reflection map it with PBR and use ring + line lights
//draw scene to texture and use as environment map


//What's new about what you're making? 

//add sense of humor - cell shading + gummy bears + care bears + rainbows 
//singing improves the world - music makes people happy 
window.lineCount = 0

function makeRoad () {

    const pipeSpline = [
        new THREE.Vector3( 0, 10, - 10 ), new THREE.Vector3( 10, 0, - 10 ),
        new THREE.Vector3( 20, 0, 0 ), new THREE.Vector3( 30, 0, 10 ),
        new THREE.Vector3( 30, 0, 20 ), new THREE.Vector3( 20, 0, 30 ),
        new THREE.Vector3( 10, 0, 30 ), new THREE.Vector3( 0, 0, 30 ),
        new THREE.Vector3( - 10, 10, 30 ), new THREE.Vector3( - 10, 20, 30 ),
        new THREE.Vector3( 0, 30, 30 ), new THREE.Vector3( 10, 30, 30 ),
        new THREE.Vector3( 20, 30, 15 ), new THREE.Vector3( 10, 30, 10 ),
        new THREE.Vector3( 0, 30, 10 ), new THREE.Vector3( - 10, 20, 10 ),
        new THREE.Vector3( - 10, 10, 10 ), new THREE.Vector3( 0, 0, 10 ),
        new THREE.Vector3( 10, - 10, 10 ), new THREE.Vector3( 20, - 15, 10 ),
        new THREE.Vector3( 30, - 15, 10 ), new THREE.Vector3( 40, - 15, 10 ),
        new THREE.Vector3( 50, - 15, 10 ), new THREE.Vector3( 60, 0, 10 ),
        new THREE.Vector3( 70, 0, 0 ), new THREE.Vector3( 80, 0, 0 ),
        new THREE.Vector3( 90, 0, 0 ), new THREE.Vector3( 100, 0, 0 )
    ]
    let bezier = []
    for (let i = 0; i < 100; i++) {
        bezier.push(
            new THREE.Vector3(0,0,0)
        )
    }
    THREE.CurvePath
    const curve = new THREE.CatmullRomCurve3(
        pipeSpline
    );
    
    const points = curve.getPoints( 50 );


    window.lineCount += 1
    const geometry = new MeshLineGeometry()
    let bool = Math.random() > .5
    const list = Array.from(Array(1000).keys().map((d, i) => [ 0, 0, -i * 10 ]))
    points 
    
    //console.log(list)
    geometry.setPoints(list)
    const material = new MeshLineMaterial({
        color: 0xffffff,
        transparent: true
     })
     let timer = { value: 0 };
     material.onBeforeCompile = function (shader) {
        console.log('compile')
        shader.uniforms.time = timer
        shader.fragmentShader = fs(window.lineCount)
        material.userData.shader = shader;

    }
    material.customProgramCacheKey = function () {

        return 2..toFixed( 1 );

    };
 
    const mesh = new THREE.Mesh(geometry, material)
     mesh.position.x = window.lineCount - 50
     mesh.position.y -= 10
     window.material = material
     setInterval(function () { 
        timer.value =  performance.now()
     }, 100)
    scene.add(mesh)
    return mesh
}

function addLines (scene, dataArray) {
    

    


    const geometry = new MeshLineGeometry()
    let bool = Math.random() > .5
    const list = Array.from(Array(1000).keys().map((d, i) => [ Math.cos(i/ 1000),  Math.sin(i/ 1000),  i / 1000 ]))
    //console.log(list)
    geometry.setPoints(list)
    const material = new MeshLineMaterial({
        color: 0xffffff
     })
    const mesh = new THREE.Mesh(geometry, material)
    setInterval(function () {
        //mesh.scale.addScalar(.1)
    }, 100)
    scene.add(mesh)
    return mesh
}

setTimeout(function () {
    
    getusermedia({audio: true}, function (err, stream) {
        console.log(stream)
        if (err) {
          return console.log(err)
        }
      
        // Next we create an analyser node to intercept data from the mic
        const context = new AudioContext()
        const analyser = context.createAnalyser()
      
        // And then we connect them together
        context.createMediaStreamSource(stream).connect(analyser)
      
        // Here we preallocate buffers for streaming audio data
        const fftSize = analyser.frequencyBinCount
        const frequencies = new Uint8Array(fftSize)
        window.voiceBuffer = frequencies
      
      })
    
})

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100000);
window.camera = camera
const gui = new dat.GUI()
// import WebGPU from 'three/addons/capabilities/WebGPU.js';
// 			import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js';
import {EXRLoader} from 'three/examples/jsm/loaders/EXRLoader'
//import { loadConfigFromFile } from 'vite'
const textureLoader = new THREE.TextureLoader()
//  import  {HDRCubeTextureLoader } from 'three/examples/jsm/loaders/HDRCubeTextureLoader.js'
//https://www.youtube.com/watch?v=SZzehktUeko&ab_channel=ChrisJones
//https://www.youtube.com/watch?v=gxxqdrrpgZc&ab_channel=HDCOLORS-ColorfulKaleidoscopeswithAddedValue
//var noise = new SimplexNoise();
//https://github.com/junni-inc/next.junni.co.jp/tree/master/src/assets
//change camera angle according to beat in smooth physics fashion
//https://exp-gemini.lusion.co/style
//https://particle-love.com/
//https://github.com/adarkforce/3D-Earth-Music-Visualizer
const cubeTextureLoader = new THREE.CubeTextureLoader()
let particleLight 
var vizInit = function (){

  var file = document.getElementById("thefile");
  var audio = document.querySelector("audio");
  var fileLabel = document.querySelector("label.file");
  

    audio.addEventListener('play', play)

const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])
environmentMap.colorSpace = THREE.SRGBColorSpace


function play() {


    window.camera = camera

    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();
    src.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 512;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    var group = new THREE.Group();
    camera.position.set(0,0,100);
    scene.add(camera);
 
    // let lines = []
    let road = []
    for (let i = 0; i < 100; i++) {
        //lines.push(addLines(scene, dataArray))
        road.push(makeRoad(scene, dataArray))
    }

    let template = new THREE.SphereGeometry( 15, 32, 16 );
    let l = template.attributes.position.array
    // lines.forEach((line, i) => {
    //     const curve = new THREE.QuadraticBezierCurve3(
    //         new THREE.Vector3( -10, 0, 0 ),
    //         new THREE.Vector3( 20, 15, 0 ),
    //         new THREE.Vector3( 10, 0, 0 )
    //     );
        
    //     const points = curve.getPoints( 50 );


    //     line.geometry.points = line.geometry.points.map((d,i) => l[i % l.length])
    //     line.position.z = -i *100
    //     line.scale.addScalar(i)
    // })
    

    // lines[50].geometry.points = lines[50].geometry.points.map(function (d,i) {
    //     return [0,0,i]
    // })

    setInterval(function(){
        camera.position.z -= 1
    }, 8)
//}, 500)
      
    const canvas = document.querySelector('canvas.webgl')
//const controls = new OrbitControls(camera, canvas)
//controls.enableDamping = true
    
    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, canvas: canvas });
    //var renderer = new WebGPURenderer();
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 100.5
    renderer.setSize(sizes.width, sizes.height);

    particleLight= new THREE.Mesh(new THREE.SphereGeometry( 3, 8, 8),
    new THREE.MeshBasicMaterial({color: 'red'}))
    ;
var bulbLight;
    particleLight.add(
        bulbLight = new THREE.PointLight( 0xffee88, 100000000000, 0, 0 )

        )
        bulbLight.castShadow = true;
        
    scene.add(particleLight)
    var hemiLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 0.02 );
    scene.add( hemiLight );


    bulbLight.power = 3500

let shit = {
    '0.0001 lx (Moonless Night)': 0.0001,
    '0.002 lx (Night Airglow)': 0.002,
    '0.5 lx (Full Moon)': 0.5,
    '3.4 lx (City Twilight)': 3.4,
    '50 lx (Living Room)': 50,
    '100 lx (Very Overcast)': 100,
    '350 lx (Office Room)': 350,
    '400 lx (Sunrise/Sunset)': 400,
    '1000 lx (Overcast)': 1000,
    '18000 lx (Daylight)': 18000,
    '50000 lx (Direct Sun)': 50000
}

    //gui.add(shit, )

    hemiLight.intensity = 50000
    //bulbMat.emissiveIntensity = bulbLight.intensity / Math.pow( 0.02, 2.0 );
    var planeGeometry = new THREE.PlaneGeometry(800, 800, 20, 20);
    var planeMaterial = new THREE.MeshLambertMaterial({
        color: 0x6904ce,
        side: THREE.DoubleSide,
        wireframe: false
    });
    
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, 30, 0);
    //group.add(plane);
    
    setInterval(function () {

    }, 10000)//hello
    var plane2 = new THREE.Mesh(planeGeometry, planeMaterial);
    plane2.rotation.x = -0.5 * Math.PI;
    plane2.position.set(0, -30, 0);
    //group.add(plane2);

    var icosahedronGeometry = new THREE.IcosahedronGeometry(10, 4);
    // var lambertMaterial = new THREE.MeshLambertMaterial({
    //     color: 0xff00ee,
    //     wireframe: false
    // });
    // new HDRCubeTextureLoader().setPath('./static/pbr')
    // .load([])
    const geometry = new THREE.BufferGeometry();
 
    //geometry.setAttribute( 'initialPosition', positions.clone() );

    //geometry.attributes.position.setUsage( THREE.DynamicDrawUsage );

    let mesh = new THREE.Points( geometry, new THREE.PointsMaterial( { size: 20, color: 'red' } ) );

    //scene.add(mesh)

    // new EXRLoader()
    // .load( 'pbr/color_map.exr', function ( texture, textureData ) {

    //     // memorial.exr is NPOT

    //     //console.log( textureData );
    //     //console.log( texture );

    //     // EXRLoader sets these default settings
    //     //texture.generateMipmaps = false;
    //     //texture.minFilter = LinearFilter;
    //     //texture.magFilter = LinearFilter;
    //     //console.log(textureData, texture)
    //     const material = new THREE.MeshBasicMaterial( { map: texture } );

    //     const quad = new THREE.PlaneGeometry( 10.5 * textureData.width / textureData.height, 1.5 );

    //     const mesh = new THREE.Mesh( quad, material );

    //     scene.add( mesh );

    //     //render();

    // } );
    var textureLoader = new THREE.TextureLoader()

    let textures = [
        '/pbr_low_res/ao_map.jpg',
        '/pbr_low_res/color_map.jpg',
        '/pbr_low_res/displacement_map.jpg',
        '/pbr_low_res/metalness_map.jpg',
        '/pbr_low_res/normal_map_opengl.jpg',
        '/pbr_low_res/render_map.jpg',
        '/pbr_low_res/roughness_map.jpg'
    ]


    const aoTexture = textureLoader.load(textures[0])
    const colorTexture = textureLoader.load(textures[1])
    const displacementTexture = textureLoader.load(textures[2])
    const metalnessTexture = textureLoader.load(textures[3])
    const normalTexture = textureLoader.load(textures[4])
    const renderTexture = textureLoader.load(textures[5])
    const roughnessTexture = textureLoader.load(textures[6])
    normalTexture.wrapS = THREE.RepeatWrapping;
    normalTexture.wrapT = THREE.RepeatWrapping;
    normalTexture.repeat.x = 10;
    normalTexture.repeat.y = 6;
    normalTexture.anisotropy = 16;
    const normalMap3 = new THREE.CanvasTexture( new FlakesTexture() );

   
    let material = new THREE.MeshPhysicalMaterial( {
        iridescenceMap : colorTexture,
		iridescenceIOR :0.3,
		iridescenceThicknessRange :[ 100, 400 ],
		iridescenceThicknessMap: displacementTexture,

		// sheenColor: new THREE.Color( 0xff0000 ),
		// sheenColorMap:renderTexture,
		//sheenRoughness: 1.0,
		//sheenRoughnessMap:colorTexture,

		// transmissionMap:roughnessTexture,

		// thickness:0,
		// thicknessMap:roughnessTexture,
	    // attenuationDistance:Infinity,
		// attenuationColor:new THREE.Color( 1, 1, 1 ),

		// specularIntensity:1.0,
		// specularIntensityMap:renderTexture,
		// specularColor:new THREE.Color( 1, 1, 1 ),
		// specularColorMap:colorTexture,

		// // _anisotropy = 0;
		// // _clearcoat = 0;
		// // _iridescence = 0;
		// // _sheen = 0.0;
		// // _transmission = 0;

        // anisotropyRotation: 0,
		// anisotropyMap:null,

		// clearcoatMap:aoTexture,
	    // clearcoatRoughness:0.0,
		 clearcoatRoughness: 0,
		// clearcoatNormalScale :new THREE.Vector2( 1, 1 ),
		// clearcoatNormalMap:null,

		// ior:1.5,

        // clearcoat: 1.0,
        // clearcoatRoughness: 0.1,
        reflectivity: 1,
        metalness: 1.0,
        roughness:0.0,
        //color: 0x0000ff,
        normalMap: normalTexture,
        flatShading: false,
        // clearcoatNormalMap: roughnessTexture,

        // normalScale: new THREE.Vector2( 0.15, 0.15 )
    } );
    
    for (let i = 0; i < 1; i++) {
        var ball = new THREE.Mesh(icosahedronGeometry, material);

        ball.position.set(i % 200, Math.floor(i / 200), Math.floor(i / 2000) );
        group.add(ball);
    }
    

    // var ambientLight = new THREE.AmbientLight(0xaaaaaa);
    // scene.add(ambientLight);

    // var spotLight = new THREE.SpotLight(0xffffff);
    // spotLight.intensity = 0.9;
    // spotLight.position.set(-10, 40, 20);
    // spotLight.lookAt(ball);
    // spotLight.castShadow = true;
    // scene.add(spotLight);
    
    //scene.add(group);

   

    window.addEventListener('resize', onWindowResize, false);
    const renderTarget = new THREE.WebGLRenderTarget(800,60,{samples: 2})
    var effectComposer = applyPostProcessing(renderer, renderTarget)

    render();


    function render() {



        scene.traverse( function ( child ) {

            if ( child.isMesh ) {

                const shader = child.material.userData.shader;

                if ( shader ) {
                    //console.log(performance.now())
                    shader.uniforms.time.value = performance.now()

                }

            }

        } );





      analyser.getByteFrequencyData(dataArray);
      let shit = dataArray.reduce(function (prev, next) {
        return prev + next
      }, 0) / dataArray.length
      window.shit = shit
      
      

       //window.unrealBloomPass.strength = shit
    // window.unrealBloomPass.strength =  
    
    let vocals = voiceBuffer.reduce(function (prev, next) {
        return prev + next
      }, 0) / voiceBuffer.length
      //if (Math.random () > .9) console.log(voiceBuffer, vocals)

        //console.log(dataArray)
      var lowerHalfArray = dataArray.slice(0, (dataArray.length/2) - 1);
      var upperHalfArray = dataArray.slice((dataArray.length/2) - 1, dataArray.length - 1);

      var overallAvg = avg(dataArray);
      var lowerMax = max(lowerHalfArray);
      var lowerAvg = avg(lowerHalfArray);
      var upperMax = max(upperHalfArray);
      var upperAvg = avg(upperHalfArray);

      var lowerMaxFr = lowerMax / lowerHalfArray.length;
      var lowerAvgFr = lowerAvg / lowerHalfArray.length;
      var upperMaxFr = upperMax / upperHalfArray.length;
      var upperAvgFr = upperAvg / upperHalfArray.length;

      //group.rotation.y += 0.005;
      //renderer.render(scene, camera);
      effectComposer.render()
      //controls.update()
      requestAnimationFrame(render);
      //uniforms[ 'time' ].value = performance.now() / 1000;


      const timer = Date.now() * 0.00025;

				particleLight.position.x = Math.sin( timer * 7 ) * 10;
				particleLight.position.y = Math.cos( timer * 5 ) * 10;
				particleLight.position.z = Math.cos( timer * 3 ) * 10;
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

        effectComposer.setSize(sizes.width, sizes.height)
        effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

  };
}

vizInit();

document.body.addEventListener('touchend', function(ev) { context.resume(); });





function fractionate(val, minVal, maxVal) {
    return (val - minVal)/(maxVal - minVal);
}

function modulate(val, minVal, maxVal, outMin, outMax) {
    var fr = fractionate(val, minVal, maxVal);
    var delta = outMax - outMin;
    return outMin + (fr * delta);
}

function avg(arr){
    var total = arr.reduce(function(sum, b) { return sum + b; });
    return (total / arr.length);
}

function max(arr){
    return arr.reduce(function(a, b){ return Math.max(a, b); })
}






function applyPostProcessing(renderer, renderTarget) {
    const effectComposer = new EffectComposer(renderer, renderTarget)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
effectComposer.setSize(sizes.width, sizes.height)

// Render pass
const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

// Dot screen pass
const dotScreenPass = new DotScreenPass()
dotScreenPass.enabled = false
effectComposer.addPass(dotScreenPass)

// Glitch pass
const glitchPass = new GlitchPass()
glitchPass.goWild = true
glitchPass.enabled = false
effectComposer.addPass(glitchPass)

// RGB Shift pass
const rgbShiftPass = new ShaderPass(RGBShiftShader)
rgbShiftPass.enabled = false
effectComposer.addPass(rgbShiftPass)

// Gamma correction pass
const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
effectComposer.addPass(gammaCorrectionPass)

// Antialias pass
if(renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2)
{
    const smaaPass = new SMAAPass()
    effectComposer.addPass(smaaPass)

    console.log('Using SMAA')
}

// Unreal Bloom pass
window.unrealBloomPass = new UnrealBloomPass()
unrealBloomPass.enabled = true
effectComposer.addPass(unrealBloomPass)

unrealBloomPass.strength = 2
unrealBloomPass.radius = 1
unrealBloomPass.threshold = 0.6

gui.add(unrealBloomPass, 'enabled')
gui.add(unrealBloomPass, 'strength').min(0).max(2).step(0.001)
gui.add(unrealBloomPass, 'radius').min(0).max(2).step(0.001)
gui.add(unrealBloomPass, 'threshold').min(0).max(1).step(0.001)

// Tin pass
const TintShader = {
    uniforms:
    {
        tDiffuse: { value: null },
        uTint: { value: null }
    },
    vertexShader: `
        varying vec2 vUv;

        void main()
        {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

            vUv = uv;
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec3 uTint;

        varying vec2 vUv;

        void main()
        {
            vec4 color = texture2D(tDiffuse, vUv);
            color.rgb += uTint;

            gl_FragColor = color;
        }
    `
}

const tintPass = new ShaderPass(TintShader)
tintPass.material.uniforms.uTint.value = new THREE.Vector3()
effectComposer.addPass(tintPass)

gui.add(tintPass.material.uniforms.uTint.value, 'x').min(- 1).max(1).step(0.001).name('red')
gui.add(tintPass.material.uniforms.uTint.value, 'y').min(- 1).max(1).step(0.001).name('green')
gui.add(tintPass.material.uniforms.uTint.value, 'z').min(- 1).max(1).step(0.001).name('blue')

    return effectComposer
} 



//rings waveform
//vortex
//sphere


//lines 
//optical illusions
//collections of objects moving in patterns
//or changing luminosity 

//midi csv
//post processing = wave form

//gradients of motion and light according to sound
//gyroscope / astrolabe

//delight + wonder
//black + white => greytone + laser + shiny

//pbr spackled batons in a ring with xy rotation by index

//make words out of particles, lines, triangles or shader -> each word poofs into something 

// const options = {
//     audio: true,
//     success: function (cts) {console.log(cts)},
//     failure: function (cts) {console.log(cts)}

// }
// navigator.mediaDevices.getUserMedia(options).then((tabStream) => {
//     const context = new AudioContext()
//             const analyser = context.createAnalyser()
          
//             // And then we connect them together
//             context.createMediaStreamSource(tabStream).connect(analyser)
          
//             // Here we preallocate buffers for streaming audio data
//             const fftSize = analyser.frequencyBinCount
//             const frequencies = new Uint8Array(fftSize)
//             window.voiceBuffer = frequencies
//     // at this point the sound of the tab becomes muted with no way to unmute it
// });

//fly towards the camera 
//convert SVG shapes of letters into characters

//railway camera - use a path for debugging -> 5 stops 
//rings 
//sphere explosion thing
//waveform hills
//midi
//vortex 
//1-6 million vertices - most lines can be somewhat static