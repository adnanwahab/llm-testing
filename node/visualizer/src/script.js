

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
import * as Curves from 'three/examples/jsm/curves/CurveExtras.js';
import { MapControls } from 'three/examples/jsm/controls/MapControls.js';



import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { MeshLineGeometry, MeshLineMaterial } from '@lume/three-meshline'

function getVocals () {
    if (! window.voiceBuffer.analyser) return 
    //  console.log('no ssl sorry!')
    window.voiceBuffer.analyser.getByteFrequencyData(window.voiceBuffer)

    let vocals = voiceBuffer.reduce(function (prev, next) {
        return prev + next
      }, 0) / voiceBuffer.length
      window.voiceBuffer.amplitude = vocals;
      return vocals
}

window.voiceBuffer = []
const canvas = document.querySelector('canvas.webgl')

function merge(...args) {
    console.log(args)
}

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
      gl_FragColor.a = .1;
      //if (vCounters > sin(time * .001)) gl_FragColor.a = 1.;
      if (vCounters > .9) gl_FragColor.a = 1.;
      //gl_FragColor.a = .1;
      //if (vCounters * 100. > time) { discard;}
      //gl_FragColor += .1;
      #include <fog_fragment>
      #include <tonemapping_fragment>
      #include <encodings_fragment>
    }
    `;

window.lineCount = 0





function leftToRight(mesh) {
    mesh.position.x = -100
    mesh.position.y = makeRand() * 200
    mesh.position.z = 0
    
    setInterval(function () { 
       //timer.value =  performance.now()
       mesh.position.x += 1
    }, 100)
 }
 function makeRand() {
    return Math.random() - .5
}

function coneTowardsCamera(mesh)  {
    let i = window.lineCount
    let radius = 50

    mesh.position.set(
        radius * Math.cos(i), radius * Math.sin(i)
    )
 
    //mesh.rotation.y += Math.PI * 1.5
    //mesh.rotation.x -= .8
    
    //mesh.lookAt(camera.position)
    //window.mesh = mesh

    let dir = new THREE.Vector3(0,0,1).applyEuler(mesh.rotation)
        setInterval(function () {
            mesh.position.add(dir)
        })
}

//waveform 
function collision() {}
function makeTornado() {}
function makeSphere() {}
function makeWaterfall() {}
function makeRings() {}
function makeWaveForm(mesh) {
    mesh.rotation.z = window.lineCount 
    mesh.rotation.x = .5
}
function makeArcs(mesh) {
    mesh.rotation.z = window.lineCount 
    mesh.rotation.x = .5
}
//opacitate out

let lines = []


let keyFrames = [
    //function () {},
    coneTowardsCamera, 
    //leftToRight,
    //makeArcs,
    function columnsMovingRight() {

    },
]
let currentKeyframe = 0;

setInterval(function () {
    //console.log(currentKeyframe)
    //currentKeyframe = (currentKeyframe + 1) % keyFrames.length
}, 5000)
//animation speech controlled by waveform

function drawLines(color, dataArray) {
    //if (Math.random() < .99) return;
    let i = window.lineCount++;
    if (currentKeyframe == 2) return drawLinesCircle(color)
    const geometry = new MeshLineGeometry()
    const list = []
    for (let i = 0; i< 100; i+=1) {
         list.push(0, 0, i * 2 - 1000)
    }
    //console.log(list)
    //debugger
    geometry.setPoints(list, (p) => 1 - (1 - p))
    const material = new MeshLineMaterial({
        color,
        transparent: false,
        //lineWidth: 1,
//    sizeAttenuation: true,
       dashArray: 2,
       dashOffset: 2,
       animateDashArray:true,
       
     })
     let timer = { value: 0 };
     
     material.onBeforeCompile = function (shader) {
        shader.uniforms.time = timer
        shader.fragmentShader = fs(window.lineCount)
        material.userData.shader = shader;
    }

    const mesh = new THREE.Mesh(geometry, material)
    setInterval(function () {
        //  mesh.position.z -= 1
         //mesh.scale.multiplyScalar(.9)
     }, 8)

    //mesh.position.y = i
    keyFrames[currentKeyframe](mesh)
    lines.push(mesh)
     setTimeout(function () {
        scene.remove(mesh)
        mesh.geometry.dispose()
        mesh.material.dispose()
     }, 5000)
    scene.add(mesh)
}

if (! navigator.mediaDevices) console.log('you need SSL probably') 
else {
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
      const context = new AudioContext()
          const analyser = context.createAnalyser()
        
          // And then we connect them together
          context.createMediaStreamSource(stream).connect(analyser)
        
          // Here we preallocate buffers for streaming audio data
          const fftSize = analyser.frequencyBinCount
          const frequencies = new Uint8Array(fftSize)
          window.voiceBuffer = frequencies
          window.voiceBuffer.analyser = analyser;
        
    })
    .catch(function(err) {
      /* Handle the error */
      console.error("Error: " + err);
    });
}

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100000);
var controls = new OrbitControls( camera, canvas);
const gui = new dat.GUI()

let particleLight 


let audio = document.querySelector('audio')
audio.addEventListener('play', play)
function play() {
    window.camera = camera

    var context = new AudioContext();
    var src = context.createMediaElementSource(document.querySelector('audio'));
    var analyser = context.createAnalyser();
    src.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 512;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    var group = new THREE.Group();
    //camera.position.set(0,10,10);
    //camera.lookAt(new THREE.Vector3(0,100,100));
    scene.add(camera);
 
    canvas.addEventListener('mousewheel', function (e ) {
        console.log(e)
    })
    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, canvas: canvas });
    renderer.toneMapping = THREE.ReinhardToneMapping
    renderer.toneMappingExposure = 100.5
    renderer.setSize(sizes.width, sizes.height);
    renderer.setClearColor(0x000000, 1.)

    particleLight= new THREE.Mesh(new THREE.SphereGeometry( 3, 8, 8),
    new THREE.MeshBasicMaterial({color: 'red'}))
 
    var hemiLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 0.02 );
    scene.add( hemiLight );
    window.addEventListener('resize', onWindowResize, false);
    const renderTarget = new THREE.WebGLRenderTarget(800,60,{samples: 2})
    var effectComposer = applyPostProcessing(renderer, renderTarget)

    render();

    function render() {
        // lines.forEach(function (l, i) {
        //     let params = {}
        //     params.animateDashOffset = true
        //     let time = Date.now()
        //     if (params.animateWidth) l.material.uniforms.lineWidth.value = params.lineWidth * (1 + 0.5 * Math.sin(5 * t + i))
        //     if (params.autoRotate) l.rotation.y += 0.125 * delta
        //     l.material.uniforms.visibility.value = params.animateVisibility ? (time / 3000) % 1.0 : 1.0
        //     l.material.uniforms.dashOffset.value -= params.animateDashOffset ? 0.01 : 0
        // })
        scene.traverse( function ( child ) {
            if ( child.isMesh ) {
                const shader = child.material.userData.shader;
                if ( shader ) {
                    shader.uniforms.time.value = performance.now()
                }
            }
        } );


      analyser.getByteFrequencyData(dataArray);
      let amplitude = dataArray.reduce(function (prev, next) {
        return prev + next
      }, 0) / dataArray.length
      //lines.forEach((line, i) => {line.scale.setScalar(dataArray[i])})

     window.unrealBloomPass.strength = 1
      let colors = {
        teal: 0x0093fe,
        red: 0xfb4f87
      }
      if (amplitude > 10) drawLines(colors.red, dataArray) //teal
      if (getVocals() > 1) drawLines(colors.teal) //fuschia

   
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

      controls.update();
      effectComposer.render()
      
      requestAnimationFrame(render);
      //uniforms[ 'time' ].value = performance.now() / 1000;
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

        effectComposer.setSize(sizes.width, sizes.height)
        effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

  };


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




// const blur5 = `
// vec4 blur5(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
//     vec4 color = vec4(0.0);
//     vec2 off1 = vec2(1.3333333333333333) * direction;
//     color += texture2D(image, uv) * 0.29411764705882354;
//     color += texture2D(image, uv + (off1 / resolution)) * 0.35294117647058826;
//     color += texture2D(image, uv - (off1 / resolution)) * 0.35294117647058826;
//     return color;
//   }`;
  
//   const blur9 = `
//   vec4 blur9(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
//     vec4 color = vec4(0.0);
//     vec2 off1 = vec2(1.3846153846) * direction;
//     vec2 off2 = vec2(3.2307692308) * direction;
//     color += texture2D(image, uv) * 0.2270270270;
//     color += texture2D(image, uv + (off1 / resolution)) * 0.3162162162;
//     color += texture2D(image, uv - (off1 / resolution)) * 0.3162162162;
//     color += texture2D(image, uv + (off2 / resolution)) * 0.0702702703;
//     color += texture2D(image, uv - (off2 / resolution)) * 0.0702702703;
//     return color;
//   }`;
  
//   const blur13 = `
//   vec4 blur13(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
//     vec4 color = vec4(0.0);
//     vec2 off1 = vec2(1.411764705882353) * direction;
//     vec2 off2 = vec2(3.2941176470588234) * direction;
//     vec2 off3 = vec2(5.176470588235294) * direction;
//     color += texture2D(image, uv) * 0.1964825501511404;
//     color += texture2D(image, uv + (off1 / resolution)) * 0.2969069646728344;
//     color += texture2D(image, uv - (off1 / resolution)) * 0.2969069646728344;
//     color += texture2D(image, uv + (off2 / resolution)) * 0.09447039785044732;
//     color += texture2D(image, uv - (off2 / resolution)) * 0.09447039785044732;
//     color += texture2D(image, uv + (off3 / resolution)) * 0.010381362401148057;
//     color += texture2D(image, uv - (off3 / resolution)) * 0.010381362401148057;
//     return color;
//   }
//   `;
  
//   export { blur5, blur9, blur13 };


function drawLinesCircle(color) {
    let i = window.lineCount++;

    const geometry = new MeshLineGeometry()
    const list = []
    let angleStep = 2 * Math.PI / 100; 
    let radius = 1//Math.random() * i
    for (let i = 0; i< 101; i++) {
        //     list.push(new THREE.Vector3(i , 0, 0))
         let theta = angleStep * i
         list.push(new THREE.Vector3(radius * Math.cos(theta), radius * Math.sin(theta), 0))
    }
    geometry.setPoints(list)
    const material = new MeshLineMaterial({
        color,
        transparent: true,
        lineWidth: .1,
     
     })
     let timer = { value: 0 };
     material.onBeforeCompile = function (shader) {
        shader.uniforms.time = timer
        shader.fragmentShader = fs(window.lineCount)
        material.userData.shader = shader;
    }
    const mesh = new THREE.Mesh(geometry, material)
  
    setInterval(function () {
        mesh.scale.addScalar(.1)
    }, 10)

        lines.push(mesh)
       
        
     setTimeout(function () {
        scene.remove(mesh)
        mesh.geometry.dispose()
        mesh.material.dispose()
     }, 5000)
    scene.add(mesh)
}