const express = require('express');
const router = express.Router();
const date = require('../utils/date');

const vkinoListParser = require("../parsers/vkino-list-parser");
const vkinoMovieParser = require("../parsers/vkino-movie-parser");

const vkinoListInstance = new vkinoListParser("gulliver");

router.get("/", (_, res) => {
    const today = date.todayYYYYMMDD();
    
    vkinoListInstance.list({date: today, lang: "ua"})
      .then(list => {
        const dto = JSON.stringify(list);
        res.send(dto);
      })
      .catch(error => {
        const dto = JSON.stringify(error);
        res.send(dto);
      });
});

const vkinoMovieInstance = new vkinoMovieParser("gulliver");

router.get("/:id", (req, res) => {
  const today = date.todayYYYYMMDD();

  vkinoMovieInstance.movie({date: today, lang: "ua", id: req.params.id})
    .then(movie => {
      const dto = JSON.stringify(movie);
      res.send(dto);
    })
    .catch(error => {
      const dto = JSON.stringify(error);
      res.send(dto);
    })
});

module.exports = router;