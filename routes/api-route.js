const express = require('express');
const router = express.Router();

const version = require("../configs/version");
const zhovtenRoute = require('./zhovten-route');
const oceanPlazaRouter = require('./ocean-plaza-router');

router.get("/", (req, res) => res.send(`Cinema Scrapper Api ${version}`));

router.use("/zhovten", zhovtenRoute);
router.use("/ocean-plaza", oceanPlazaRouter);

module.exports = router;