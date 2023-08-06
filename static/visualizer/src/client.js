
let lyrics = []
let speech = []

import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@6.6.2/dist/fuse.esm.js'

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


import _, { map } from 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.13.6/underscore-esm-min.js';


document.querySelector('audio').currentTime = 30;
document.querySelector('audio').volume = 0.02;
const startNewSong = async (e) => {
    let lyrics

    if (e.title) {
        console.log(e)
        console.log('/media/youtube/' + e.title + '.mp3')
        document.querySelector('audio').children[0].src
         = 'youtube/' + e.title + '.mp3'
         document.querySelector('audio').load()
        lyrics = Object.values(e.lyrics)
     } else {

        let req = await fetch('/api/v1', {headers: {'Content-Type': 'application/json',
        type: 'post',
        body: JSON.stringify({search: e.search })
      }});
      
        let json = await req.json();
        lyrics = Object.values(json)

     } 
    document.querySelector('audio').play()

  





    let timestamps = lyrics
    //Object.keys(json).map(str => str.split('-->')[0].trim().slice(1))

  console.log(timestamps)
  let now = Date.now()
  let i = 0
  //00:03.980
    let lastIdx = -1
    requestAnimationFrame(function recur() {
      let elapsed = (Date.now() - now) / 1000
      //console.log(elapsed)
      let ts = timestamps.find(ts => ts[0] > elapsed)
      let i = timestamps.indexOf(ts) - 1
        if (lastIdx !== i) {
            changeLyrics(timestamps[i][2])
            lastIdx = i
        }
      requestAnimationFrame(recur)
      //lyrics.push(lyrics[i][2])
    //   document.querySelector('.lyric-match').textContent = 
    //   _.zip(lyrics, speech)
    })
  }


document.querySelector('button').addEventListener('click', startNewSong)

function changeLyrics(lyrics) {
  //document.querySelector('.lyrics').textContent = lyrics[i]

  document.querySelector('.lyrics').innerHTML = lyrics.split(' ').map(word => {
    return '<span> ' + word + ' </span>'
  })
}



//lyric list 
//speech List
//compare the length and if the length of tokens is similar, highlight words differently





function getYT2(shit, cb) {
    let req =  fetch('//localhost:3000/youtube-search', {
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
        let shit = data.items.map(item => `<li><a href="${base + item.id.videoId}"></a>${item.snippet.title}</li>`)

        get('.search-results').innerHTML = shit.join('')
     })
})


document.querySelector('.search-results').addEventListener('click', function (e) {
let shit = e.target.children[0].href
console.log(shit)
fetch('http://localhost:5000/play-song', {
mode: "cors",
method: "POST",
headers: {'Content-Type': 'application/json'},
body: JSON.stringify({title: e.target.textContent, href: shit})
}).then(req => req.json()).then( json => startNewSong(json))

document.querySelector('.search-results').innerHTML = ''
})

function get (q) { return document.querySelector(q) }
const recognizedText = document.querySelector('.recognizedText');


const grammar =
"#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;";
const recognition = new webkitSpeechRecognition();
const speechRecognitionList = new webkitSpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = true;
recognition.lang = "en-US";
recognition.interimResults = true;
recognition.maxAlternatives = 1;

const diagnostic = document.querySelector(".output");
const bg = document.querySelector("html");


recognition.start();
console.log("Ready to receive a color command.");


let count = 0
recognition.onresult = (event) => {
 
const transcript = event.results[event.results.length - 1][0].transcript;
recognizedText.textContent = transcript;
speech.push(transcript)
Array.from(document.querySelector('.lyrics').children).forEach((span, i) => {
if (i < transcript.length) 
span.style.background = 'pink'
})
//console.log(event.results)
};
