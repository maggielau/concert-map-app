var express = require('express');
var axios = require('axios');
var router = express.Router();
var path = require('path');

//require controller modules
let event_controller = require('../controllers/eventController');


// Have Node serve the files for our built React app
router.use(express.static(path.resolve(__dirname, '../frontend/build')));


//Test API
router.get("/api", (req, res) => {
  res.json({ message: "Hello from server!!" });
});

//Request to Deezer API to get artist tracks
router.get("/artist", event_controller.deezer_req);

//Request to Ticketmaster API to get concert listings for a date
router.get("/concerts", event_controller.tm_data);

//Fetch event data from database for query date
router.get("/events", event_controller.event_data_by_date)


// All other GET requests not handled before will return our React app
router.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});



module.exports = router;
