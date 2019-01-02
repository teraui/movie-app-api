const moment = require("moment");
require("moment-timezone");

module.exports = {
  todayYYYYMMDD: function() {
    const now = moment();
    return now.tz("Europe/Kiev").format("YYYY-MM-DD");
  }
}