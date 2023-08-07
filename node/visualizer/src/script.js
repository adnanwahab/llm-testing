

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

//rings waveform
//vortex
//sphere







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
window.lineCount = 0
function addLines (scene, dataArray) {
    window.lineCount += 1
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
// make lines look treesa -> edit the shader so it has - > use a high res wood texture
//     file.onchange = function(){
//     fileLabel.classList.add('normal');
//     audio.classList.add('active');
//     var files = this.files;
    
//     audio.src = URL.createObjectURL(files[0]);
//     audio.load();
//     audio.play();
//     play();
//   }
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
    camera.lookAt(scene.position);
    scene.add(camera);
    // scene.background = environmentMap
    // scene.environment = environmentMap
    let lines = []
    for (let i = 0; i < 100; i++)
        lines.push(addLines(scene, dataArray))


//100 * 10,000
//setInterval(() => {
    let template = new THREE.SphereGeometry( 15, 32, 16 );
    let l = template.attributes.position.array
    console.time('a')
    lines.forEach((line, i) => {
        line.geometry.points = line.geometry.points.map((d,i) => l[i % l.length])
        line.position.z = -i *100
    })
    console.timeEnd('a')

    setInterval(function(){
        //camera.position.z -= 1
    }, 8)
//}, 500)
      
    const canvas = document.querySelector('canvas.webgl')
const controls = new OrbitControls(camera, canvas)
//controls.enableDamping = true
    
    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, canvas: canvas });
    //var renderer = new WebGPURenderer();
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 1.5
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
    let particleList = new Float32Array(1e5)
    for (let i = 0; i < 1e5; i+=3 ) {
        particleList[i] = Math.random() * 100
        particleList[i+1] = Math.random() * 100
        particleList[i+2] = Math.random() * 100
    }
    
    geometry.setAttribute( 'position',  new THREE.BufferAttribute( particleList, 3 ));
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

      makeRoughGround(plane, modulate(upperAvgFr, 0, 1, 0.5, 4));
      makeRoughGround(plane2, modulate(lowerMaxFr, 0, 1, 0.5, 4));
      
      makeRoughBall(ball, modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8), modulate(upperAvgFr, 0, 1, 0, 4));

      //group.rotation.y += 0.005;
      //renderer.render(scene, camera);
      effectComposer.render()
      controls.update()
      requestAnimationFrame(render);

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

    function makeRoughBall(mesh, bassFr, treFr) {
        
        mesh.geometry.attributes.position.array.forEach(function (vertex, i) {
            var offset = mesh.geometry.parameters.radius;
            //console.log(offset)
            var amp = 7;
            var time = window.performance.now();
            //vertex.normalize();
            var rf = 0.00001;
            //let val = mesh.geometry.attributes.position.array[i]
            //var distance = (offset + bassFr ) + noise.noise3D(val + time *rf*7, val +  time*rf*8, val + time*rf*9) * amp * treFr;
            // vertex.multiplyScalar(distance);
            // console.log(mesh.geometry.attributes.position.array)
            //mesh.geometry.attributes.position.array[i] *= Math.random()
        });
        mesh.geometry.verticesNeedUpdate = true;
        mesh.geometry.normalsNeedUpdate = true;
        // mesh.geometry.computeVertexNormals();
        // mesh.geometry.computeFaceNormals();
    }

    function makeRoughGround(mesh, distortionFr) {
        // mesh.geometry.vertices.forEach(function (vertex, i) {
        //     var amp = 2;
        //     var time = Date.now();
        //     var distance = (noise.noise2D(vertex.x + time * 0.0003, vertex.y + time * 0.0001) + 0) * distortionFr * amp;
        //     vertex.z = distance;
        // });
        // mesh.geometry.verticesNeedUpdate = true;
        // mesh.geometry.normalsNeedUpdate = true;
        // mesh.geometry.computeVertexNormals();
        // mesh.geometry.computeFaceNormals();
    }

    audio.play();
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

unrealBloomPass.strength = 0.3
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

// // Displacement pass
// const DisplacementShader = {
//     uniforms:
//     {
//         tDiffuse: { value: null },
//         uTime: { value: null },
//         uNormalMap: { value: null }
//     },
//     vertexShader: `
//         varying vec2 vUv;

//         void main()
//         {
//             gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

//             vUv = uv;
//         }
//     `,
//     fragmentShader: `
//         uniform sampler2D tDiffuse;
//         uniform float uTime;
//         uniform sampler2D uNormalMap;

//         varying vec2 vUv;

//         void main()
//         {
//             vec3 normalColor = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;
//             vec2 newUv = vUv + normalColor.xy * 0.1;
//             vec4 color = texture2D(tDiffuse, newUv);

//             vec3 lightDirection = normalize(vec3(- 1.0, 1.0, 0.0));
//             float lightness = clamp(dot(normalColor, lightDirection), 0.0, 1.0);
//             color.rgb += lightness * 2.0;

//              gl_FragColor = color;
//         }
//     `
// }

// const displacementPass = new ShaderPass(DisplacementShader)
// displacementPass.material.uniforms.uTime.value = 0
// displacementPass.material.uniforms.uNormalMap.value = textureLoader.load('/textures/interfaceNormalMap.png')
// effectComposer.addPass(displacementPass)
    return effectComposer
} 

// // /**
// //  * Base
// //  */
// // // Debug
// // 

// // // Canvas

// // // Scene
// // const scene = new THREE.Scene()

// // /**
// //  * Loaders
// //  */
// // const gltfLoader = new GLTFLoader()
// // const cubeTextureLoader = new THREE.CubeTextureLoader()
// // 

// // /**
// //  * Update all materials
// //  */
// // const updateAllMaterials = () =>
// // {
// //     scene.traverse((child) =>
// //     {
// //         if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
// //         {
// //             child.material.envMapIntensity = 2.5
// //             child.material.needsUpdate = true
// //             child.castShadow = true
// //             child.receiveShadow = true
// //         }
// //     })
// // }

// // /**
// //  * Environment map
// //  */


// // /**
// //  * Models
// //  */
// // gltfLoader.load(
// //     '/models/DamagedHelmet/glTF/DamagedHelmet.gltf',
// //     (gltf) =>
// //     {
// //         gltf.scene.scale.set(2, 2, 2)
// //         gltf.scene.rotation.y = Math.PI * 0.5
// //         scene.add(gltf.scene)

// //         updateAllMaterials()
// //     }
// // )

// // /**
// //  * Lights
// //  */
// // const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
// // directionalLight.castShadow = true
// // directionalLight.shadow.mapSize.set(1024, 1024)
// // directionalLight.shadow.camera.far = 15
// // directionalLight.shadow.normalBias = 0.05
// // directionalLight.position.set(0.25, 3, - 2.25)
// // scene.add(directionalLight)

// // /**
// //  * Sizes
// //  */


// // window.addEventListener('resize', () =>
// // {
// //     // Update sizes
// //     sizes.width = window.innerWidth
// //     sizes.height = window.innerHeight

// //     // Update camera
// //     camera.aspect = sizes.width / sizes.height
// //     camera.updateProjectionMatrix()

// //     // Update renderer
// //     renderer.setSize(sizes.width, sizes.height)
// //     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// //     // Update effect composer

// // })

// // /**
// //  * Camera
// //  */
// // // Base camera
// // const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// // camera.position.set(4, 1, - 4)
// // scene.add(camera)

// // // Controls
// // const controls = new OrbitControls(camera, canvas)
// // controls.enableDamping = true

// // /**
// //  * Renderer
// //  */
// // const renderer = new THREE.WebGLRenderer({
// //     canvas: canvas,
// //     antialias: true
// // })
// // renderer.shadowMap.enabled = true
// // renderer.shadowMap.type = THREE.PCFShadowMap
// // renderer.useLegacyLights = false

// // renderer.setSize(sizes.width, sizes.height)
// // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// // /**
// //  * Post processing
// //  */
// // const renderTarget = new THREE.WebGLRenderTarget(
// //     800,
// //     600,
// //     {
// //         samples: 2
// //     }
// // )

// // // Effect composer

// // /**
// //  * Animate
// //  */
// // const clock = new THREE.Clock()

// // const tick = () =>
// // {
// //     const elapsedTime = clock.getElapsedTime()

// //     // Update passes
// //     displacementPass.material.uniforms.uTime.value = elapsedTime

// //     // Update controls
// //     controls.update()

// //     // Render
// //     // renderer.render(scene, camera)
// //     effectComposer.render()

// //     // Call tick again on the next frame
// //     window.requestAnimationFrame(tick)
// // }

// // tick()







function init() {

    const container = document.getElementById( 'container' );

    camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );

    scene = new THREE.Scene();

    const geometry = new THREE.PlaneGeometry( 2, 2 );

    uniforms = {
        time: { value: 1.0 }
    };

    const material = new THREE.ShaderMaterial( {

        uniforms: uniforms,
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent

    } );

    const mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

    requestAnimationFrame( animate );

    uniforms[ 'time' ].value = performance.now() / 1000;

    renderer.render( scene, camera );

}