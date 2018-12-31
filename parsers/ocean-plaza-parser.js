const requestPromise = require('request-promise');
const cheerio = require('cheerio');

const MovieListItem = require("../models/movie-list-item");
const MovieItem = require("../models/movie-item");

const BASE_URL = "https://cinemaciti.ua";
const MOVIES_LIST_URL = "/ocean-plaza/rozklad";
const MOVIE_URL = "/ocean-plaza/film/{id}";

const options = {
  uri: BASE_URL,
  transform: function (body) {
    return cheerio.load(body);
  }
};

async function getMovie(id) {
    const requestConfig = Object.assign({}, options);

    requestConfig.uri = requestConfig.uri + MOVIE_URL.replace(/{id}/, id);

    try {
      const $ = await requestPromise(requestConfig);
      const movie = {};

      const name = $("title");
      const img = $(".movie__img img");
      const desc = $(".movie__description");
      const schedule = $(".session_full").children();

      movie.id = id;
      movie.name = name.length ? name.text() : null;
      movie.imageUrl = img.length ? BASE_URL + img.attr("src") : null;
      movie.description = desc.length ? desc.text().trim().replace(/\n/g, " ") : null;
      movie.todayDate = Date.now();
      movie.halls = schedule.map((_, item) => $(item).find(".session-block__time").text());
      
      return new MovieItem(movie);

    } catch (error) {
      return error;
    }
}

async function getMoviesList() {
    
  const requestConfig = Object.assign({}, options);

  requestConfig.uri = requestConfig.uri + MOVIES_LIST_URL;

  try {
    const $ = await requestPromise(requestConfig);
    const moviesData = $(".movie-list__sessions").children();
    
    const data = [];

    moviesData.each((_, session) => {
      const _session = $(session);

      data.push(new MovieListItem({
        id: getId(_session),
        name: getName(_session),
        age: null,
        imageUrl: BASE_URL + getImageUrl(_session),
        schedule: getSchedule(_session, $)
      }))
    });

    return data;

  } catch(error) {
    return error;
  }
}

function getSchedule(session, $) {
    try {
        const scheduleItems = session.find(".session__schedule").children();
        const schedule = [];
        scheduleItems.each((_, item) => {
            const _item = $(item);

            schedule.push(
                _item.find(".session-block__time").text()
            );
        });
        return schedule;
    } catch(e) {
        console.error(e);
        return null;
    }
}

function getImageUrl(session) {
    try {
        const poster = session.find(".poster-small_session");
        const img = poster.find("img");
        return img.attr("src");
    } catch(e) {
        console.error(e);
        return null;
    }
}

function getId(session) {
  try {
    const url = session.find(".poster-small_session a").attr("href");
    const lastSlashIndex = url.lastIndexOf("/");
    const id = url.slice(lastSlashIndex + 1);
    return id;
  } catch(e) {
    console.error(e);
    return null;
  }
}

function getName(session) {
  try {
    const container = session.find(".session__movie-name");
    const text = container.children().remove().end().text();
    return text;
  } catch(e) {
    console.error(e);
    return null;
  }  
}

module.exports = {
  list: getMoviesList,
  movie: getMovie
};


