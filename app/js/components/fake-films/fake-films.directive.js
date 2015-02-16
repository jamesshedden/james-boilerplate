'use strict';

var _ = require('lodash');

angular.module('fakeFilmsComponentModule', [])
  .directive('fakeFilms', [
  '$http',
  function fakeFilmsDirective($http) {
    return {
      restrict: 'A',
      link: function(scope) {

        var films;
        var isRequesting;
        var hasClicked;
        var fakeFilm;

        scope.fakeFilms = [];

        scope.isRequesting = false;
        scope.hasClicked = false;

        // Search terms designed to return very general results
        var words = ['the', 'you', 'me', 'us', 'our', 'love', 'war',
          'hate', 'red', 'blue', 'green', 'yellow', 'black', 'white',
          'sex', 'bird', 'tree', 'cat', 'dog', 'bear', 'day', 'night',
          'car', 'bike', 'house', 'school', 'work', 'death', 'life',
          'die', 'live', 'kill', 'fish', 'sea', 'land', 'earth', 'space', 
          'planet', 'should', 'would', 'could', 'why', 'what', 'how',
          'where', 'he', 'she', 'him', 'her', 'they', 'can', 'will',
          'must', 'trust', 'try', 'truth', 'true',
        ];

        function makeFilm(films) {

          var firstFilm = films[0];
          var secondFilm = films[1];

          if (
            firstFilm.plot.indexOf("...") > -1 ||
            secondFilm.plot.indexOf("...") > -1 || 
            firstFilm.plot === "N/A" ||
            secondFilm.plot === "N/A"
          ) {
            // Reject strings ending in "..." or with "N/A" as a plot.
            // Is there a way to test this in the initial requests?
            searchFilms();
          } else {

            var firstPlotWords = firstFilm.plot.split(' ');
            var secondPlotWords = secondFilm.plot.split(' ');

            firstPlotWords = firstPlotWords.slice(firstPlotWords.length * 0.9, firstPlotWords.length);
            secondPlotWords = secondPlotWords.slice(0, secondPlotWords.length * 0.6);

            var plots = secondPlotWords.concat(firstPlotWords);
            var plot = plots.join(' ');

            fakeFilm = {};
            fakeFilm.plot = plot;
            fakeFilm.title = makeTitle(firstFilm.title, secondFilm.title);
            fakeFilm.director = makeDirector(firstFilm.director, secondFilm.director);
            fakeFilm.year = firstFilm.year;
            fakeFilm.actors = makeActors(firstFilm.actors, secondFilm.actors);

            scope.fakeFilms.push(fakeFilm);
            scope.isRequesting = false; 
          }
        }

        function makeTitle(firstTitle, secondTitle) {
          var firstTitleWords = firstTitle.split(' ');
          var secondTitleWords = secondTitle.split(' ');

          firstTitleWords = firstTitleWords.splice(0, Math.round(firstTitleWords.length / 2));
          secondTitleWords = secondTitleWords.splice(Math.round(secondTitleWords.length / 2, secondTitleWords.length));

          var titles = firstTitleWords.concat(secondTitleWords);
          var title = titles.join(' ');
          return title;
        }

        function makeDirector(firstDirector, secondDirector) {
          var firstDirectorWords = firstDirector.split(' ');
          var secondDirectorWords = secondDirector.split(' ');

          var firstDirectorWords = firstDirectorWords.slice(0, 1)
          var secondDirectorWords = secondDirectorWords.slice(secondDirectorWords.length - 1, secondDirectorWords.length);

          var directors = firstDirectorWords.concat(secondDirectorWords);
          var director = directors.join(' ');
          return director;
        }

        function makeActors(firstActors, secondActors) {
          var firstActorsNames = firstActors.split(', ');
          var secondActorsNames = secondActors.split(', ');

          firstActorsNames = firstActorsNames.splice(0, Math.round(firstActorsNames.length / 2));
          secondActorsNames = secondActorsNames.splice(Math.round(secondActorsNames.length / 2, secondActorsNames.length));

          var actors = firstActorsNames.concat(secondActorsNames);
          actors = [actors.slice(0, -1).join(', '), actors.slice(-1)[0]].join(' and ');
          return actors;
        }

        function getPlot(response) {
          var shuffled = _.shuffle(response.data.Search)[0];
          return $http.get("http://www.omdbapi.com/?r=json&i="+shuffled.imdbID)
            .then(function(response){

              var film = {
                title: response.data.Title,
                year: response.data.Year,
                director: response.data.Director,
                genre: response.data.Genre,
                actors: response.data.Actors,
                plot: response.data.Plot
              };

              films.push(film);
            });
        }

        var searchFilms = function() {
          films = [];
          scope.hasClicked = true;
          scope.isRequesting = true;

          var firstTerm = _.shuffle(words)[0];
          var secondTerm = _.shuffle(words)[0];

          $http.get("http://www.omdbapi.com/?r=json&type=movie&s="+firstTerm)
            .then(function(response){
              return getPlot(response);
            })
            .then(function(){
              return $http.get("http://www.omdbapi.com/?r=json&type=movie&s="+secondTerm)
                .then(function(response){
                  return getPlot(response);
                });
            })
            .then(function(){
              makeFilm(films);
            });
        }

        scope.searchFilms = searchFilms;

      }
    };
  }
]);