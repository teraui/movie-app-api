const requestPromise = require('request-promise');
const cheerio = require('cheerio');

const MovieItem = require('../models/movie-item');

const URL = "https://vkino.ua/{lang}/show/{id}/kiev/{cinema}?date={date}";

class VkinoMovieParser {
  constructor(cinema) {
    this.cinema = cinema;
  }

  async movie(props) {
    const uri = URL
      .replace(/{date}/, props.date)
      .replace(/{lang}/, props.lang)
      .replace(/{id}/, props.id)
      .replace(/{cinema}/,  this.cinema);

    const requestOptions = {
      uri: uri,
      transform: (body) => {
        return cheerio.load(body);
      }
    }
    try {
      const $ = await requestPromise(requestOptions);

      const container = $("#content");
      
      const movieItem = new MovieItem({
        id: props.id,
        name: this.name(container),
        imageUrl: this.imageUrl(container),
        description: this.description(container),
        todayDate: Date.now(),
        halls: this.halls(container, $),
        age: this.age(container),
        director: this.director(container, $),
        releaseDate: this.releaseDate(container, $),
        roles: this.roles(container, $),
        country: this.country(container, $),
        duration: this.duration(container, $),
        movieType: this.movieType(container, $),
        lang: null
      });

      return movieItem;

    } catch(error) {
      return error;
    }
  }

  name(container) {
    const title = container.find(".title-info .title");

    if (!title.length) return null;

    return title.text().trim();
  }

  imageUrl(container) {
    const image = container.find(".img-holder img");

    if (!image.length) return null;

    const srcset = image.attr("data-srcset");
    const toArray = srcset.split(" ");

    if (toArray.length !== 4) return null;

    return toArray[2];
  }

  description(container) {
    const description = container.find(".description-info .text-block");

    if (!description.length) return null;

    return description.text().trim();
  }

  halls(container, $) {
    const schedule = container.find("ul.schedule-list");

    if (!schedule.length) return null;

    const hall = {name: "", sessions: []};
    const dataArray = Array.from(schedule.children());
    
    for (let i = 0; i < dataArray.length; i++) {
      const li = $(dataArray[i]);
      if (!li.length) continue;

      const session = li.find("span:first-of-type");
      if (!session.length) continue;
      
      if (!session.text().length) continue;
      hall.sessions.push(session.text());
    }
    
    return [hall];
  }

  age(container) {
    const age = container.find(".age.mobile-hidden");

    if (!age.length) return null;

    return age.text().trim();
  }

  director(container, $) {
    const misc = container.find(".aside-info .film-data-list");

    if (!misc.length) return null;

    const director = Array.from(misc.children()).slice(-1);

    if (!director) return null;

    return $(director).text();
  }

  releaseDate(container, $) {
    const misc = container.find(".aside-info .film-data-list");
    
    if (!misc.length) return null;

    const releaseDate = Array.from(misc.children()).slice(1, 2);

    if (!releaseDate) return null;

    return $(releaseDate).text();
  }

  roles(container, $) {
    const misc = container.find(".aside-info .film-data-list");
    
    if (!misc.length) return null;

    const roles = Array.from(misc.children()).slice(7, 8);

    if (!roles) return null;

    return $(roles).text();
  }

  country(container, $) {
    const misc = container.find(".aside-info .film-data-list");
    
    if (!misc.length) return null;

    const country = Array.from(misc.children()).slice(5, 6);

    if (!country) return null;

    return $(country).text();
  }

  duration(container, $) {
    const dataList = container.find(".film-block .film-data-list");

    if (!dataList.length) return null;

    const duration = Array.from($(dataList).find("dd")).slice(-1);

    if (!duration) return null;

    const rawText = $(duration).text();
    const text = rawText.replace(/\s+/g, '');

    return text;
  }

  movieType(container, $) {
    const dataList = container.find(".film-block .film-data-list");

    if (!dataList.length) return null;

    const movieType = Array.from($(dataList).find("dd")).slice(0,1);

    if (!movieType) return null;

    return $(movieType).text();
  }
}

module.exports = VkinoMovieParser;