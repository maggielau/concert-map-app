/*
    This controller handles all functions related to collecting event data from
    APIs and scrapers
*/
const Event = require("../models/event");
const req = require('express/lib/request');
const res = require('express/lib/response');
const axios = require('axios');

//Pull event data from ticketmaster API and populate to database
exports.tm_data = function(req, res) {
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
      //create new event object
      let event = new Event(
        {
            date: date,
            venueName: response.data._embedded.events[0]._embedded.venues[0].name,
            position: {
                lat: response.data._embedded.events[0]._embedded.venues[0].location.latitude,
                lng: response.data._embedded.events[0]._embedded.venues[0].location.longitude
            },
            artists: [response.data._embedded.events[0]._embedded.attractions[0].name],
            doors: response.data._embedded.events[0].dates.start.localTime,
            cost: `$${response.data._embedded.events[0].priceRanges[0].min}-${response.data._embedded.events[0].priceRanges[0].max}`,
            purchaseURL: response.data._embedded.events[0].url
        }
      );

      //save event to database
      event.save(function (err) {
        if (err) { return next(err); }
        console.log("Event saved");
      })

      //venue name
      console.log(response.data._embedded.events[0]._embedded.venues[0].name);
      //position
      console.log(response.data._embedded.events[0]._embedded.venues[0].location.latitude);
      console.log(response.data._embedded.events[0]._embedded.venues[0].location.longitude);
      //artists
      console.log(response.data._embedded.events[0]._embedded.attractions[0].name); //Array with multiple lineups
      //doors
      console.log(response.data._embedded.events[0].dates.start.localTime);
      //cost
      console.log(`$${response.data._embedded.events[0].priceRanges[0].min}-${response.data._embedded.events[0].priceRanges[0].max}`)
      //purchaseURL
      console.log(response.data._embedded.events[0].url);


      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({message: err});
    });
};

//Request to Deezer API to get event artist tracks for music preview
exports.deezer_req = function(req, res) {
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
};
