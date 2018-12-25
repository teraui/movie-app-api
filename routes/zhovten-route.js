const express = require('express');
const router = express.Router();
const zhovtenParser = require('../parsers/zhovten-parser');

router.get("/", (req, res) => {
    zhovtenParser.list().then(data => {
        res.send(JSON.stringify(data));
    }).catch(error => {
        res.send(JSON.stringify(error));
    });
});

router.get("/:id", (req, res) => {
    zhovtenParser.movie(req.params.id).then(data => {
        res.send(JSON.stringify(data));
    }).catch(error => {
        res.send(JSON.stringify(error));
    });
});

module.exports = router;