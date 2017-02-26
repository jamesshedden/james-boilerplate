import $ from 'jquery';
import _ from 'lodash';

const FLICKR_APP_KEY = '882fcc919a695a0c5ba1006442a39e28';
const FLICKR_API_URL = 'https://api.flickr.com/services/rest/?';

const SETS = [
  '72157630041700780',
  '72157629726204684',
  '72157642202880093',
  '72157644117123950',
  '72157633462787741',
  '72157632587225076',
  '72157632019634699',
  '72157631826703111',
  '72157630914852730',
];

const ADJECTIVES = [
  'wonderful', 'terrific', 'beautiful', 'splendid', 'magical',
  'pretty', 'handsome', 'superb', 'brilliant', 'magnificent', 'gorgeous',
  'curious', 'strange', 'intriguing', 'beguiling', 'mysterious',
];

const NOUNS = [
  'cat', 'dog', 'frog', 'toad', 'elephant', 'tiger', 'lion', 'mouse',
  'rabbit', 'cow', 'horse', 'leopard', 'eagle', 'donkey',
];

const PHRASES = [
  'It\'s difficult to decide, but I think this might be one of my favourite images in the collection.',
  'Well, this piece is one of my most-loved in the entire collection.',
  'Of all the inspiring works of art we have here, this is surely one of my favourites.',
  'This was my favourite piece last week, but these things change so quickly! It\'s certainly up there.',
  'Nigel and I had to agree to disagree on the meaning of this one - isn\'t it interesting?',
  'This image is Nigel\'s favourite - I suppose I can see the appeal.',
  'I can\'t tell you the squabbles Nigel and I have shared over this one - any rate, it\'s quite the specimen.',
];

let params = {
  'api_key': FLICKR_APP_KEY,
  'method': 'flickr.photosets.getPhotos',
  'format': 'json',
  'nojsoncallback': 1,
  'user_id': '85009674@N00',
};

let randomise = (min, max) => Math.floor(Math.random() * (max - 1)) + 1;

function getWrongName() {
  return $.getJSON('http://api.uinames.com/?amount=1&country=germany&callback=?');
}

function flickrRequest(params) {
  return $.getJSON(FLICKR_API_URL, params);
}

function setLoader(option) {
  if (option === true) {
    $('body').addClass('is-loading');
  } else if (option === false) {
    $('body').removeClass('is-loading');
  }
}

function insertImage(name) {
  flickrRequest(params).done(function(data){
    _.extend(params, {
      'photoset_id': SETS[Math.floor(Math.random()*SETS.length)],
    });

    flickrRequest(params).done(function(data){
      let photo = data.photoset.photo[randomise(1,data.photoset.photo.length)];
      let url = `https://farm${photo.farm}.staticflickr.com` +
        `/${photo.server}/${photo.id}_${photo.secret}.jpg`;

      $('#art').html(`
        <img src="${url}">
      `);

      $('#form').html(`
        <p>
          <form id="repeat-art">
            <p>
              ${PHRASES[Math.floor(Math.random()*PHRASES.length)]}
              What a ${ADJECTIVES[Math.floor(Math.random()*ADJECTIVES.length)]}
              ${NOUNS[Math.floor(Math.random()*NOUNS.length)]}!
            </p>

            <label for="repeat-art-submit">
              <p><em>Do you like it, ${name}?</em></p>
            </label>

            <p>
              <input type="submit" id="repeat-art-submit" value="Show me more art, Robert!">
              <input type="submit" id="repeat-art-submit" value="My name's not ${name}">
            </p>
          </form>
        </p>
      `);

      $('#art').removeClass('is-hidden');
      setLoader(false);

      $('#repeat-art').on('submit', function(e){
        e.preventDefault();
        setLoader(true);
        $('#art').addClass('is-hidden');
        this.remove();
        insertImage(name);
      });
    });
  });
}

function getName(chosenName, wrongName) {
  let el;

  if (chosenName === 'robert' || chosenName === 'Robert') {
    el = `
      <form id="name-form" class="form" action="">
        <label for="art-form-submit">
          <p>Don't be silly - I'm Robert. <em>Try again!</em></p>
        </label>

        <p>
          <input type="text" id="name-form-name">
          <input type="submit" value="Here's my name">
        </p>
      </form>
    `;
  } else if (chosenName === 'nigel' || chosenName === 'Nigel') {
    el = `
      <form id="name-form" class="form" action="">
        <label for="art-form-submit">
          <p>
            Nigel, how many times to I have to ask you? <em>Please don't bother me
            when I'm entertaining gallery visitors</em>. In fact, I can see a new
            visitor approaching, so please make yourself useful elsewhere.
          </p>
          <p>
            Hello! Don't mind Nigel, he's just leaving. What's your name?
          </p>
        </label>

        <p>
          <input type="text" id="name-form-name">
          <input type="submit" value="Here's my name">
        </p>
      </form>
    `;
  } else {
    el = `
      <form id="art-form">
        <label for="art-form-submit">
          <p>${wrongName}? <em>What a coincidence</em>! Well, ${wrongName}, would you like to see some art?</p>
        </label>

        <p>
          <input id="art-form-submit" type="submit" value="Show me art, Robert!">
          <input id="art-form-submit" type="submit" value="My name's not ${wrongName}">
        </p>
      </form>
    `;
  }

  $('#form').html(el);

  $('#art-form').on('submit', function(){
    this.remove();
    setLoader(true);
    insertImage(wrongName);
    return false;
  });

  $('#name-form').on('submit', function(e){
    let chosenName = $('#name-form-name').val();
    console.log(chosenName);
    e.preventDefault();
    this.remove();
    getName(chosenName, wrongName);
  });
}

$(document).ready(function(){
  let wrongName = 'Robert';
  let nameForm = $('#name-form');

  $('#name-form').on('submit', function(e){
    let chosenName = $('#name-form-name').val();
    e.preventDefault();
    this.remove();
    getName(chosenName, wrongName);
  });
});
