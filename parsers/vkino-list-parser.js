const requestPromise = require('request-promise');
const cheerio = require('cheerio');

const MovieListItem = require("../models/movie-list-item");

const URL = "https://vkino.ua/{lang}/cinema/kiev/{cinema}?date={date}";

class VkinoListParser {
  constructor(cinema) {
    this.cinema = cinema;
  }

  async list(props) {
    const uri = URL
      .replace(/{date}/, props.date)
      .replace(/{lang}/, props.lang)
      .replace(/{cinema}/, this.cinema);

    const requestOptions = {
      uri: uri,
      transform: (body) => {
        return cheerio.load(body);
      }
    }
    try {
      const $ = await requestPromise(requestOptions);

      const container = $(".schedule-box");
      const dataArray = Array.from(container.children());

      const isNoSessions = container.find(".showtimes-error");

      if (isNoSessions.length) return [];

      const list = [];

      for (let i = 0; i < dataArray.length; i++) {
        const item = $(dataArray[i]);
        
        if (item.attr("class") == "hint") continue;
        
        const movieListItem = new MovieListItem({
          id: this.id(item),
          name: this.name(item),
          age: this.age(item),
          imageUrl: this.imageUrl(item),
          schedule: this.schedule(item, $),
        });

        list.push(movieListItem);
      }

      return list;

    } catch(error) {
      return error;
    }
  }

  id(item) {
    const linkTag = item.find(".film-logo-holder");

    if (!linkTag.length) return null;

    return linkTag.attr("href").split("/")[3];
  }

  name(item) {
    const nameContainer = item.find(".film-name");

    if (!nameContainer.length) return null;

    return nameContainer.text().replace(/\n/, "").trim();
  }

  age(item) {
    const ageContainer = item.find(".limit-age span");

    if (!ageContainer.length) return null;

    return ageContainer.text().trim();
  }

  imageUrl(item) {
    const image = item.find(".film-logo-holder img");

    if (!image.length) return null;

    const srcset = image.attr("data-srcset");
    const [smallImage, undefined, bigImage] = srcset.split(/\s/);
  
    return bigImage ? bigImage : smallImage;
  }

  schedule(item, $) {
    const scheduleList = item.find(".schedule-list");

    if (!scheduleList.length) return null;

    const scheduleArray = Array.from(scheduleList.children());
    
    const result = [];
    
    for (let i = 0; i < scheduleArray.length; i++) {
  
      const textContainer = $(scheduleArray[i]).find("span:first-of-type");
      
      if (!textContainer.length) continue;

      const text = textContainer.text().trim();
      result.push(text);
    }

    return result;
  }
}

module.exports = VkinoListParser;