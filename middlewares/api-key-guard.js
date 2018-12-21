const apiKey = require('../configs/api-key');

function apiKeyGuard(req, res, next) {
    if (req.query.apiKey !== apiKey) {
        return res.status(403).send("Provided incorrect api key");
    }

    next();
}

module.exports = apiKeyGuard;