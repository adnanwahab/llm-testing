
let lyrics = []
let speech = []
import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@6.6.2/dist/fuse.esm.js'
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import _, { map } from 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.13.6/underscore-esm-min.js';

let baseName = window.location.host === 'localhost:5173' ? 'http://localhost:3000/' : 'http://karaoke.ngrok.io/'

//deploy nodeapp with fly.io -> deploy music directory to s3 


const startNewSong = async (e) => {
    console.log(e)
    audioTag.children[0].src= e.href 
    audioTag.play()
    let lyrics =e.Lyrics || e.lyrics

  let now = Date.now()
  let i = 0
    
    function recur() {
        let elapsed = audioTag.currentTime
  //console.log(elapsed)
        let foundIndex = lyrics.findIndex((sentence, idx) => {
          let [start, end, words] = sentence; 

          if (idx === 0) return elapsed < end
          return start < elapsed && elapsed < end
        })

          if (foundIndex > -1) {
              changeLyrics(lyrics[foundIndex][2], foundIndex)
          }
        requestAnimationFrame(recur)
      }
      recur()
  }

//https://www.shadertoy.com/view/Xllfzl - bird


//https://www.shadertoy.com/view/XsBXWt fractal candy land cartyoon 

//https://www.shadertoy.com/view/cddSRM best
// https://www.shadertoy.com/view/md3Sz4
//  
//  https://www.shadertoy.com/view/XtcXWM fractal
//  https://www.shadertoy.com/view/tsGGRw fractal
//https://www.shadertoy.com/view/stGGzz fractal mouse 
//https://www.shadertoy.com/view/wdjGzz

//https://www.shadertoy.com/view/7lfBWj

//https://www.shadertoy.com/view/NstyzB

//https://www.shadertoy.com/view/ldsBRn watwe
///https://www.shadertoy.com/view/4ttGDH cell
//https://www.shadertoy.com/view/cddSRM

//https://www.shadertoy.com/view/4slGz4
//https://www.shadertoy.com/view/XdByzy stvoi
//https://www.shadertoy.com/view/ldlXRS ring
//make the worrds work good - use d3 and text spans around each word and then - word by word karaoke matching 
let audioTag = document.querySelector('audio')
//audioTag.currentTime = 30;
audioTag.volume = 0.02;

const startApp = () => {
    getTranscript(mockData.title, mockData.href)
    //audioTag.children[0].src = mockData.href
    //https://drive.google.com/u/0/uc?id=1ED0mshSxI5TuykjtLcUbUVNNm7zKYz-i&export=download
    audioTag.load()
    audioTag.currentTime = 12
    audioTag.muted = false
    // let test = {lyrics:[[0,21.2," Somebody hand me a cigarette I know I ain't had one in over a week"],[21.2,27.240000000000002," Somebody pour me a double shot Been getting bitter by the day, but tonight"],[27.240000000000002,28.240000000000002," I drink"],[28.240000000000002,35.24," I say I gotta get over you and get sober too I got a lot of habits I gotta kick"],[35.24,41.24," Weigh out all your options and take your pick"],[41.24,48.24," I can either burn the bar down Or I can take your number out my phone"],[48.24,55.24," I can give you up right now Never want you back long as I'm half stoned"],[55.24,60.24," If you want me to quit, you want me to get you out of my heart"],[60.24,63.24," And baby, out my mind I hate to tell you, girl"],[63.24,68.24000000000001," But I'm only quitting one thing at a time"],[68.24000000000001,75.24000000000001," I know I got me some problems About a thousand memories I gotta forget"],[75.24000000000001,82.24000000000001," But if I'm gonna solve them Baby, I'll take all the help I can get"],[82.24,86.24," If you ain't gonna kiss me Then I'll take some whiskey, some grizzly"],[86.24,91.24," Nicotine, amphetamines too You want me to stop some of that"],[91.24,95.24," Or you want me to stop loving you And what you want me to do"],[95.24,102.24," I can either burn the bar down Or I can take your number out my phone"],[102.24,109.24," I can give you up right now Never want you back long as I'm half stoned"],[109.24000000000001,114.24000000000001," If you want me to quit, you want me to get you out of my heart"],[114.24000000000001,117.24000000000001," And baby, out my mind I hate to tell you, girl"],[117.24000000000001,122.24000000000001," But I'm only quitting one thing at a time"],[122.24000000000001,124.24000000000001," Oh yeah, I hate to tell you"],[129.24,131.24," Oh yeah, I hate to tell you"],[131.24,140.24," I ain't no superman, I'm just the way I am"],[140.24,143.24," If I'm gonna move on Then I need me something in my hand"],[143.24,149.24," Ain't nothing wrong with that And if you ain't coming back"],[149.24,156.24," I can either burn the bar down Or I can take your number out my phone"],[156.24,163.24," I can give you up right now Never want you back long as I'm half stoned"],[163.24,168.24," If you want me to quit, you want me to get you out of my heart"],[168.24,171.24," And baby, out my mind I hate to tell you, girl"],[171.24,176.24," But I'm only quitting one thing at a time"],[176.24,178.24," Oh yeah, I hate to tell you"],[183.24,185.24," Oh yeah, I hate to tell you"],[186.24,191.24," Oh yeah, I hate to tell you"]],"title":"035. Morgan Wallen - One Thing At A Time.mp3","href":"/media/Billboard%20Hot%20100%20Singles%20Chart%20(24-June-2023)%20Mp3%20320kbps%20[PMEDIA]%20%E2%AD%90%EF%B8%8F/035.%20Morgan%20Wallen%20-%20One%20Thing%20At%20A%20Time.mp3"}
    // startNewSong(test)
}
get('.play-button').addEventListener('click', startApp)

let speechRecognition
function changeLyrics(lyrics, index) {
  let lyricContainer = document.querySelector('.lyrics')
  if (lyricContainer.__index__ == index) return;
  lyricContainer.__index__ = index

  speechRecognition = createSpeechGrammar(lyrics)
  lyricContainer.innerHTML = lyrics.split(' ').map(word => {
    return '<span> ' + word + ' </span>'
  }).join('')
}

function getYT2(shit, cb) {
    console.log('music library search')
    let req =  fetch( baseName + 'media-library-search', {
      headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({search: shit}),
    method: 'POST',
  }).then(req => req.json()).then(json => cb(json))
}

let getYT = _.debounce(getYT2, 1000)

let base = 'https://www.youtube.com/watch?v='
document.querySelector('.yt').addEventListener('keyup', function(event) {
 let shit = event.target.value
 console.log('123')
     getYT(shit, (data) => {
        console.log(data)
        let shit = Object.keys(data).map(item => `<li><a href="${data[item]}"></a>${item}</li>`)

        get('.search-results').innerHTML = shit.join('')
     })
})
let mockData = {title: "03. Jamiroquai - Cosmic Girl (Remastered).mp3", href: "./media/Various Artists - 90's Smash hits (2022) Mp3 320kbps [PMEDIA] \u2b50\ufe0f/03. Jamiroquai - Cosmic Girl (Remastered).mp3"}

document.querySelector('.search-results').addEventListener('click', clickSearchResults)

function getTranscript (title, href) {
    fetch(baseName + 'play-song', {
    mode: "cors",
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({title, href})
    }).then(req => req.json()).then( json => startNewSong(json))
} 

function clickSearchResults(e) {
    getTranscript(e.target.textContent, e.target.children[0].href)
    document.querySelector('.search-results').innerHTML = ''
}

function get (q) { return document.querySelector(q) }


function createSpeechGrammar(grammarList) {
    const recognition = new webkitSpeechRecognition();
    const speechRecognitionList = new webkitSpeechGrammarList();
    grammarList = '#JSGF V1.0; grammar colors; public <color> =' + grammarList.split(' ').join(' | ')
    speechRecognitionList.addFromString(grammarList, 1);
    recognition.grammars = speechRecognitionList;
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.start();
    speech.length = 0;
    recognition.onresult = (event) => {
        let results = []
        for (let key of event.results) {
            results.push(key[0].transcript)
        }
        results = results.join('').split(' ')
        //speech.push(transcript)
        // console.log(speech)
        Array.from(document.querySelector('.lyrics').children).forEach((span, i) => { if (i <= results.length) span.style.background = 'pink' })
    } 
    return recognition
};

