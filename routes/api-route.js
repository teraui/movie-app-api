const express = require('express');
const router = express.Router();

const version = require("../configs/version");

const zhovtenRoute = require('./zhovten-route');
// const oceanPlazaRouter = require('./ocean-plaza-router');
const skymallRouter = require("./skymall-route");
const kievrusRouter = require("./kievrus-route");
const gulliverRouter = require('./gulliver-route');

router.get("/", (req, res) => res.send(`Cinema Scrapper Api ${version}`));

router.use("/zhovten", zhovtenRoute);
// router.use("/ocean-plaza", oceanPlazaRouter);
router.use("/skymall", skymallRouter);
router.use("/kievrus", kievrusRouter);
router.use("/gulliver", gulliverRouter);

module.exports = router;