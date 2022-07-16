/*
    This controller handles all functions related to collecting event data from
    APIs and scrapers
*/
const Event = require("../models/event");
const req = require('express/lib/request');
const res = require('express/lib/response');
const axios = require('axios');
const populateEventdb = require('../middleware/populateEventdb');

//Pull event data from ticketmaster API and populate to database
exports.tm_data = function(req, res) {
  // read query parameters
  let startdate = req.query["startdate"];
  let enddate = req.query["enddate"];

  // craft Ticketmaster API URL
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?radius=20&city=Toronto&classificationName=music&localStartDateTime=${startdate}T00%3A00%3A01%2C${enddate}T23%3A59%3A59&apikey=${process.env.TM_API_KEY}`;

  axios({
    url: url,
    method: "get",
  })
    .then(response => {

      //Array to hold all events returned by the API call
      let newEvents = [];

      //If response has paginated API, iterate through each page
      if (response.data.page.totalPages > 1) {

      }

      //loop through all the returned events on the page
      for (let i=0; i<response.data._embedded.events.length; i++) {
        
        //Check if event contains artists (some ticketmaster concerts do not have artists)
        let newEventArtists = [];
        if (response.data._embedded.events[i]._embedded.attractions !== undefined) {
            //Populate array for artists for events with multiple lineups
            for (let j=0; j<response.data._embedded.events[i]._embedded.attractions.length; j++) {
                newEventArtists.push(response.data._embedded.events[i]._embedded.attractions[j].name);
            }
        }
        //otherwise there is no artist, populate field with event name
        else {
            newEventArtists.push(response.data._embedded.events[i].name)
        }

        //Populate cost (does not always exist in TM API)
        let eventCost = "";
        if (response.data._embedded.events[i].priceRanges === undefined) {
            eventCost = "Unknown";
        }
        else {
            eventCost = `$${response.data._embedded.events[i].priceRanges[0].min}-${response.data._embedded.events[i].priceRanges[0].max}`;
        }


        //create new event object
        let newEvent = new Event(
            {
                date: response.data._embedded.events[i].dates.start.localDate,
                venueName: response.data._embedded.events[i]._embedded.venues[0].name,
                position: {
                    lat: response.data._embedded.events[i]._embedded.venues[0].location.latitude,
                    lng: response.data._embedded.events[i]._embedded.venues[0].location.longitude
                },
                artists: newEventArtists,
                doors: response.data._embedded.events[i].dates.start.localTime,
                cost: eventCost,
                purchaseURL: response.data._embedded.events[i].url
            }
        );

        //append new event object to array
        newEvents.push(newEvent);

      }

      //Add events from array to database, if event already exists in the database then it will update
      newEvents.forEach(function (event) {
        let query = {
            "artists": event.artists,
            "date": event.date,
            "venueName": event.venueName
        }
        Event.findOneAndUpdate(query, event, { upsert: true, new: true }, function(err, doc) {
            if (err) { return console.log(err); }
        });
      });

      res.status(200).json(response.data);
    })
    .catch((err) => {
        console.log(err);
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
