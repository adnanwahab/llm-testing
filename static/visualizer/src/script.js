

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


//https://www.youtube.com/watch?v=SZzehktUeko&ab_channel=ChrisJones
//https://www.youtube.com/watch?v=gxxqdrrpgZc&ab_channel=HDCOLORS-ColorfulKaleidoscopeswithAddedValue
var noise = new SimplexNoise();
var vizInit = function (){

  var file = document.getElementById("thefile");
  var audio = document.querySelector("audio");
  var fileLabel = document.querySelector("label.file");
  

    audio.addEventListener('play', play)

//     file.onchange = function(){
//     fileLabel.classList.add('normal');
//     audio.classList.add('active');
//     var files = this.files;
    
//     audio.src = URL.createObjectURL(files[0]);
//     audio.load();
//     audio.play();
//     play();
//   }
  
function play() {
    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();
    src.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 512;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    var scene = new THREE.Scene();
    var group = new THREE.Group();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0,0,100);
    camera.lookAt(scene.position);
    scene.add(camera);

    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    var planeGeometry = new THREE.PlaneGeometry(800, 800, 20, 20);
    var planeMaterial = new THREE.MeshLambertMaterial({
        color: 0x6904ce,
        side: THREE.DoubleSide,
        wireframe: true
    });
    
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, 30, 0);
    group.add(plane);
    
    var plane2 = new THREE.Mesh(planeGeometry, planeMaterial);
    plane2.rotation.x = -0.5 * Math.PI;
    plane2.position.set(0, -30, 0);
    group.add(plane2);

    var icosahedronGeometry = new THREE.IcosahedronGeometry(10, 4);
    var lambertMaterial = new THREE.MeshLambertMaterial({
        color: 0xff00ee,
        wireframe: true
    });

    var ball = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
    ball.position.set(0, 0, 0);
    group.add(ball);

    var ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.intensity = 0.9;
    spotLight.position.set(-10, 40, 20);
    spotLight.lookAt(ball);
    spotLight.castShadow = true;
    scene.add(spotLight);
    
    scene.add(group);

    document.getElementById('out').appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    render();

    function render() {
      analyser.getByteFrequencyData(dataArray);

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

      group.rotation.y += 0.005;
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function makeRoughBall(mesh, bassFr, treFr) {
        console.log(mesh)
        // mesh.geometry.vertices.forEach(function (vertex, i) {
        //     var offset = mesh.geometry.parameters.radius;
        //     var amp = 7;
        //     var time = window.performance.now();
        //     vertex.normalize();
        //     var rf = 0.00001;
        //     var distance = (offset + bassFr ) + noise.noise3D(vertex.x + time *rf*7, vertex.y +  time*rf*8, vertex.z + time*rf*9) * amp * treFr;
        //     vertex.multiplyScalar(distance);
        // });
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

















































// /**
//  * Base
//  */
// // Debug
// const gui = new dat.GUI()

// // Canvas
// const canvas = document.querySelector('canvas.webgl')

// // Scene
// const scene = new THREE.Scene()

// /**
//  * Loaders
//  */
// const gltfLoader = new GLTFLoader()
// const cubeTextureLoader = new THREE.CubeTextureLoader()
// const textureLoader = new THREE.TextureLoader()

// /**
//  * Update all materials
//  */
// const updateAllMaterials = () =>
// {
//     scene.traverse((child) =>
//     {
//         if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
//         {
//             child.material.envMapIntensity = 2.5
//             child.material.needsUpdate = true
//             child.castShadow = true
//             child.receiveShadow = true
//         }
//     })
// }

// /**
//  * Environment map
//  */
// const environmentMap = cubeTextureLoader.load([
//     '/textures/environmentMaps/0/px.jpg',
//     '/textures/environmentMaps/0/nx.jpg',
//     '/textures/environmentMaps/0/py.jpg',
//     '/textures/environmentMaps/0/ny.jpg',
//     '/textures/environmentMaps/0/pz.jpg',
//     '/textures/environmentMaps/0/nz.jpg'
// ])
// environmentMap.colorSpace = THREE.SRGBColorSpace

// scene.background = environmentMap
// scene.environment = environmentMap

// /**
//  * Models
//  */
// gltfLoader.load(
//     '/models/DamagedHelmet/glTF/DamagedHelmet.gltf',
//     (gltf) =>
//     {
//         gltf.scene.scale.set(2, 2, 2)
//         gltf.scene.rotation.y = Math.PI * 0.5
//         scene.add(gltf.scene)

//         updateAllMaterials()
//     }
// )

// /**
//  * Lights
//  */
// const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
// directionalLight.castShadow = true
// directionalLight.shadow.mapSize.set(1024, 1024)
// directionalLight.shadow.camera.far = 15
// directionalLight.shadow.normalBias = 0.05
// directionalLight.position.set(0.25, 3, - 2.25)
// scene.add(directionalLight)

// /**
//  * Sizes
//  */
// const sizes = {
//     width: window.innerWidth * .75,
//     height: window.innerHeight * .75
// }

// window.addEventListener('resize', () =>
// {
//     // Update sizes
//     sizes.width = window.innerWidth
//     sizes.height = window.innerHeight

//     // Update camera
//     camera.aspect = sizes.width / sizes.height
//     camera.updateProjectionMatrix()

//     // Update renderer
//     renderer.setSize(sizes.width, sizes.height)
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//     // Update effect composer
//     effectComposer.setSize(sizes.width, sizes.height)
//     effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// })

// /**
//  * Camera
//  */
// // Base camera
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// camera.position.set(4, 1, - 4)
// scene.add(camera)

// // Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

// /**
//  * Renderer
//  */
// const renderer = new THREE.WebGLRenderer({
//     canvas: canvas,
//     antialias: true
// })
// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFShadowMap
// renderer.useLegacyLights = false
// renderer.toneMapping = THREE.ReinhardToneMapping
// renderer.toneMappingExposure = 1.5
// renderer.setSize(sizes.width, sizes.height)
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// /**
//  * Post processing
//  */
// const renderTarget = new THREE.WebGLRenderTarget(
//     800,
//     600,
//     {
//         samples: 2
//     }
// )

// // Effect composer
// const effectComposer = new EffectComposer(renderer, renderTarget)
// effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// effectComposer.setSize(sizes.width, sizes.height)

// // Render pass
// const renderPass = new RenderPass(scene, camera)
// effectComposer.addPass(renderPass)

// // Dot screen pass
// const dotScreenPass = new DotScreenPass()
// dotScreenPass.enabled = false
// effectComposer.addPass(dotScreenPass)

// // Glitch pass
// const glitchPass = new GlitchPass()
// glitchPass.goWild = true
// glitchPass.enabled = false
// effectComposer.addPass(glitchPass)

// // RGB Shift pass
// const rgbShiftPass = new ShaderPass(RGBShiftShader)
// rgbShiftPass.enabled = false
// effectComposer.addPass(rgbShiftPass)

// // Gamma correction pass
// const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
// effectComposer.addPass(gammaCorrectionPass)

// // Antialias pass
// if(renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2)
// {
//     const smaaPass = new SMAAPass()
//     effectComposer.addPass(smaaPass)

//     console.log('Using SMAA')
// }

// // Unreal Bloom pass
// const unrealBloomPass = new UnrealBloomPass()
// unrealBloomPass.enabled = false
// effectComposer.addPass(unrealBloomPass)

// unrealBloomPass.strength = 0.3
// unrealBloomPass.radius = 1
// unrealBloomPass.threshold = 0.6

// gui.add(unrealBloomPass, 'enabled')
// gui.add(unrealBloomPass, 'strength').min(0).max(2).step(0.001)
// gui.add(unrealBloomPass, 'radius').min(0).max(2).step(0.001)
// gui.add(unrealBloomPass, 'threshold').min(0).max(1).step(0.001)

// // Tin pass
// const TintShader = {
//     uniforms:
//     {
//         tDiffuse: { value: null },
//         uTint: { value: null }
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
//         uniform vec3 uTint;

//         varying vec2 vUv;

//         void main()
//         {
//             vec4 color = texture2D(tDiffuse, vUv);
//             color.rgb += uTint;

//             gl_FragColor = color;
//         }
//     `
// }

// const tintPass = new ShaderPass(TintShader)
// tintPass.material.uniforms.uTint.value = new THREE.Vector3()
// effectComposer.addPass(tintPass)

// gui.add(tintPass.material.uniforms.uTint.value, 'x').min(- 1).max(1).step(0.001).name('red')
// gui.add(tintPass.material.uniforms.uTint.value, 'y').min(- 1).max(1).step(0.001).name('green')
// gui.add(tintPass.material.uniforms.uTint.value, 'z').min(- 1).max(1).step(0.001).name('blue')

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

//             gl_FragColor = color;
//         }
//     `
// }

// const displacementPass = new ShaderPass(DisplacementShader)
// displacementPass.material.uniforms.uTime.value = 0
// displacementPass.material.uniforms.uNormalMap.value = textureLoader.load('/textures/interfaceNormalMap.png')
// effectComposer.addPass(displacementPass)

// /**
//  * Animate
//  */
// const clock = new THREE.Clock()

// const tick = () =>
// {
//     const elapsedTime = clock.getElapsedTime()

//     // Update passes
//     displacementPass.material.uniforms.uTime.value = elapsedTime

//     // Update controls
//     controls.update()

//     // Render
//     // renderer.render(scene, camera)
//     effectComposer.render()

//     // Call tick again on the next frame
//     window.requestAnimationFrame(tick)
// }

// tick()