/*
    This controller handles all functions related to collecting event data from
    APIs and scrapers
*/
const Event = require("../models/event");
const req = require("express/lib/request");
const res = require("express/lib/response");
const axios = require("axios");
const populateEventdb = require("../middleware/populateEventdb");
const { response } = require("../app");

//Pull event data from ticketmaster API and populate to database
exports.tm_data = function (req, res) {
  // read query parameters
  let startdate = req.query["startdate"];
  let enddate = req.query["enddate"];

  // craft Ticketmaster API URL
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?radius=20&city=Toronto&classificationName=music&localStartDateTime=${startdate}T00%3A00%3A01%2C${enddate}T23%3A59%3A59&apikey=${process.env.TM_API_KEY}`;

  //read data
  populateEventdb.stepThruTMData(
    startdate,
    enddate,
    url
  );

  res.status(200).json("Pulling TM Data");
};

//Request to Deezer API to get event artist tracks for music preview
exports.deezer_req = function (req, res) {
  // read query parameters
  const term = req.query["term"];

  // craft Deezer API URL
  const url = `https://api.deezer.com/search?q=artist:"${term}"`;

  axios({
    url: url,
    method: "get",
  })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
};
