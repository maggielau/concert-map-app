const axios = require("axios");
const Event = require("../models/event");
const req = require("express/lib/request");
const res = require("express/lib/response");
const { response } = require("../app");

/*
Makes a call to the Ticketmaster URL and compiles all relevant concert event data
into an array. If there are multiple pages returned from the API, function
iterates through each page to compile the data.
*/
function stepThruTMData(startdate, enddate, url) {
  axios({
    url: url,
    method: "get",
  })
    .then((response) => {
      //compile events from first page
      newEvents = collectTMData(url);

      if (response.data.page.totalPages > 1) {
        //Build in delay to avoid 429 status from Ticketmaster API
        const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        //loop through remaining pages
        const pageLoop = async () => {
          for (let i = 1; i < response.data.page.totalPages; i++) {
            await wait(1000);
            let nextURL = `https://app.ticketmaster.com/discovery/v2/events.json?radius=20&city=Toronto&classificationName=music&localStartDateTime=${startdate}T00%3A00%3A01%2C${enddate}T23%3A59%3A59&page=${i}&size=20&apikey=${process.env.TM_API_KEY}`;
            collectTMData(nextURL);
          }
        };

        pageLoop();
      }
    })
    .catch((err) => {
      console.log(err);
    });

  return;
}

function collectTMData(url) {
  axios({
    url: url,
    method: "get",
  })
    .then((response) => {
      console.log(response.status);
      let newEvents = [];

      //loop through all the returned events on the page
      for (let i = 0; i < response.data._embedded.events.length; i++) {
        //Check if event contains artists (some ticketmaster concerts do not have artists)
        let newEventArtists = [];
        if (
          response.data._embedded.events[i]._embedded.attractions !== undefined
        ) {
          //Populate array for artists for events with multiple lineups
          for (
            let j = 0;
            j < response.data._embedded.events[i]._embedded.attractions.length;
            j++
          ) {
            newEventArtists.push(
              response.data._embedded.events[i]._embedded.attractions[j].name
            );
          }
        }
        //otherwise there is no artist, populate field with event name
        else {
          newEventArtists.push(response.data._embedded.events[i].name);
        }

        //Populate cost (does not always exist in TM API)
        let eventCost = "";
        if (response.data._embedded.events[i].priceRanges === undefined) {
          eventCost = "Unknown";
        } else {
          eventCost = `$${response.data._embedded.events[i].priceRanges[0].min}-${response.data._embedded.events[i].priceRanges[0].max}`;
        }

        //Some TM events do not have a position/location, only log events with location
        if (
          response.data._embedded.events[i]._embedded.venues[0].location !==
          undefined
        ) {
          //create new event object
          let newEvent = new Event({
            date: response.data._embedded.events[i].dates.start.localDate,
            venueName:
              response.data._embedded.events[i]._embedded.venues[0].name,
            position: {
              lat: response.data._embedded.events[i]._embedded.venues[0]
                .location.latitude,
              lng: response.data._embedded.events[i]._embedded.venues[0]
                .location.longitude,
            },
            artists: newEventArtists,
            doors: response.data._embedded.events[i].dates.start.localTime,
            cost: eventCost,
            purchaseURL: response.data._embedded.events[i].url,
          });

          //append new event object to array
          newEvents.push(newEvent);
        }
      }

      //Add events from array to database, if event already exists in the database then it will update
      newEvents.forEach(function (event) {
        let query = {
          artists: event.artists,
          date: event.date,
          venueName: event.venueName,
        };
        Event.findOneAndUpdate(
          query,
          event,
          { upsert: true, new: true },
          function (err, doc) {
            if (err) {
              return console.log(err);
            }
          }
        );
      });
    })
    .catch((err) => {
      console.log(err);
    });

  return;
}

module.exports = { stepThruTMData, collectTMData };
