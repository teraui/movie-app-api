const express = require('express');
const router = express.Router();
const oceanPlazaParser = require('../parsers/ocean-plaza-parser');

router.get("/", (req, res) => {
  oceanPlazaParser.list().then(data => {
     res.send(JSON.stringify(data));
  }).catch(error => {
      res.send(JSON.stringify(error));
  });
});

router.get("/:id", (req, res) => {
  oceanPlazaParser.movie(req.params.id).then(data => {
      res.send(JSON.stringify(data));
  }).catch(error => {
      res.send(JSON.stringify(error));
  });
});

module.exports = router;