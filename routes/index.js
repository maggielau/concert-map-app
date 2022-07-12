var express = require('express');
var axios = require('axios');
var router = express.Router();
var path = require('path');

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// Have Node serve the files for our built React app
router.use(express.static(path.resolve(__dirname, '../frontend/build')));


//Test API
router.get("/api", (req, res) => {
  res.json({ message: "Hello from server!!" });
});

//Request to Deezer API to get artist tracks
router.get("/artist", (req, res) => {
  // read query parameters
  const term = req.query["term"];

  // craft Deezer API URL
  const url = `https://api.deezer.com/search?q=artist:"${term}"`;


  axios({
    url: url,
    method: "get",
  })
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({message: err});
    });

});

//Request to Ticketmaster API to get concert listings for a date
router.get("/concerts", (req, res) => {
  // read query parameters
  const date = req.query["date"];

  // craft Ticketmaster API URL
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?radius=20&city=Toronto&classificationName=music&localStartDateTime=${date}T00%3A00%3A01%2C${date}T23%3A59%3A59&apikey=${process.env.TM_API_KEY}`;

  let concerts = [];

  axios({
    url: url,
    method: "get",
  })
    .then(response => {
      console.log(response.data._embedded.events[0].name);
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({message: err});
    });

});


// All other GET requests not handled before will return our React app
router.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});



module.exports = router;
