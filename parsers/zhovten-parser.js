const requestPromise = require('request-promise');
const cheerio = require('cheerio');

const MovieListItem = require("../models/movie-list-item");
const MovieItem = require("../models/movie-item");

const BASE_URL = "https://zhovten-kino.kiev.ua";
const MOVIES_LIST_URL = "/sessions";
const MOVIE_URL = "/movie/{id}";

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

    const name = $('.mvi__slider__heading');
    const todayDateContainer = $(".schedule__dates");
    const scheduleHallsContainer = $(".schedule__halls");
    const imageContainer = $('.mvi__poster');
    const description = $(".mvi__synopsis");
    const generalInfo = $(".mvi__kvs");

    const movie = {};

    movie.id = id;
    movie.name = name.length ? name.text() : null;
    movie.imageUrl = imageContainer.length ? normalizeUrl(imageContainer.find("img").attr("src")) : null;
    movie.description = description.length ? description.find("p").text() : null;
    movie.todayDate = Date.now();

    if (scheduleHallsContainer.length) {
      const hallsSchedule = [];

      scheduleHallsContainer.children().each((_, hall) => {
        const hallName = $(hall).find(".schedule__hall__name").text();
        const sessions = Array.from($(".schedule__hall__sessions").children());
        hallsSchedule.push({
          name: hallName,
          sessions: sessions.map(session => $(session).children().remove().end().text())
        });
      });

      movie.halls = hallsSchedule;
    }

    if (generalInfo.length) {
      const array = Array.from(generalInfo.children());

      movie.age = extractGeneralItem($, array, "Вік:");
      movie.director = extractGeneralItem($, array, "Режисер:");
      movie.releaseDate = extractGeneralItem($, array, "Дата виходу:");;
      movie.lang = extractGeneralItem($, array, "Мова:");
      movie.movieType = extractGeneralItem($, array, "Жанр:");
      movie.duration = extractGeneralItem($, array, "Тривалість:");
      movie.country = extractGeneralItem($, array, "Виробництво:");
      movie.roles = extractGeneralItem($, array, "У головних ролях:");
    }

    return new MovieItem(movie);

  } catch(error) {
    return error;
  }
}

async function getMoviesList() {

  const requestConfig = Object.assign({}, options);

  requestConfig.uri = requestConfig.uri + MOVIES_LIST_URL;

  try {
    const $ = await requestPromise(requestConfig);
    const moviesData = $(".schedule__films").children();

    const data = [];

    moviesData.each((_, movie) => {
      const scheduleContainer = $(movie).find(".schedule__film__sessions");
      const scheduleData = [];

      scheduleContainer.children().each((_, schedule) => {
        scheduleData.push(
          $(schedule).children().remove().end().text()
        );   
      });

      const link = $(movie).find("a");

      if (link.length) {
        const id = link.attr("href").replace("/movie/", "");
        const name = link.find(".schedule__film__title");
        const age = link.find(".age_restriction");
        const imageUrl = link.find(".schedule__film__poster");

        data.push(new MovieListItem({
          id: id,
          name: name.length ? name.text() : null,
          age: age.length ? age.text() : null,
          imageUrl: imageUrl.length ? normalizeUrl(imageUrl.attr("src")) : null,
          schedule: scheduleData
        }));
      } 
    });
    
    return data;

  } catch(error) {
    return error;
  }
} 

function normalizeUrl(url) {
  return BASE_URL + url;
}

function extractGeneralItem($, array, pattern) {
  const item = array.find(item => $(item).find(".mvi__key").text() === pattern);

  if (!$(item).length) {
    return null;
  }
  
  return $(item).find(".mvi__val").text();
}

module.exports = {
  list: getMoviesList,
  movie: getMovie
};