const express = require("express");
var cors = require("cors")
const apiKeyGuard = require('./middlewares/api-key-guard');
const app = express();
const port = process.env.PORT || 8080;

const version = require('./configs/version');
const api = require('./routes/api-route');

app.use(apiKeyGuard);
app.use(cors());

app.use(`/api/${version}/`, api);

app.get("*", (req, res) => res.redirect(`/api/${version}/`));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))