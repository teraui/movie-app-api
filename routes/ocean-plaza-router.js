const express = require('express');
const router = express.Router();
const oceanPlazaParser = require('../parsers/ocean-plaza-parser');

router.get("/", (req, res) => {
  oceanPlazaParser.list().then(data => {
      res.send(JSON.stringify({
          movies: data,
          error: null
      }));
  }).catch(error => {
      res.send(JSON.stringify({
          movies: [],
          error: error
      }));
  });
});

router.get("/:id", (req, res) => {
  oceanPlazaParser.movie(req.params.id).then(data => {
      res.send(JSON.stringify({
          movie: data,
          error: null
      }));
  }).catch(error => {
      res.send(JSON.stringify({
          movies: null,
          error: error
      }));
  });
});

module.exports = router;