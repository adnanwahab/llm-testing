const express = require('express')
const app = express()
const port = 3000
const fs = require('fs')
const API_KEY = 'AIzaSyBHBJVlW-EHxH0kj-S78kfK2Cghde_Swbw';
const axios = require('axios');

const cors = require('cors')
app.use(cors({ origin: 'http://localhost:5000' }));


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/templates/media-server.html');

})



app.get('/fs', (req, res) => {
  let data = fs.readdirSync('./media').map(link => {  
    
    
     return { href: link, title: link} })
  res.send(data)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.post('/youtube-search', (req, res) => {
  console.log('yt search', req.params)
  let data = fs.readdirSync('./media').map(link => { return { href: link, title: link} })
  hello(req.params.search, function (data) {
    res.send(data)
  })
})

//hello('gojo vs ', (data) => console.log(JSON.stringify((data))))
app.use(express.static('media'))



// Set your YouTube API key and search query


 function hello (query, cb) {

  const url = 'https://www.googleapis.com/youtube/v3/search';
  const params = {
    part: 'snippet',
    q: query,
    key: API_KEY,
    type: 'video',  // You can specify the type of results (video, channel, playlist)
    maxResults: 10  // You can adjust the number of results to retrieve
  };

  // Make the API request
  axios.get(url, { params })
    .then(response => {
      // Check if the request was successful
      if (response.status === 200) {
        // Extract and print the video titles and video IDs from the search results
        const data = response.data;
        cb(data)
      } else {
        console.error(`Error: ${response.status}`);
      }
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
} 
