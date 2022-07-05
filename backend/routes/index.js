var express = require('express');
var axios = require('axios');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Test API
router.get("/api", (req, res) => {
  res.json({ message: "Hello from server!!" });
});

//Test API CORS request
router.get("/artist", (req, res) => {
  // read query parameters
  const term = req.query["term"];

  // craft IEX API URL
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



module.exports = router;
