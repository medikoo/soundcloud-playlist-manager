// Controller for Add tracks search form

'use strict';

var deferred  = require('deferred/lib/deferred')
  , Track     = require('../model/track')
  , Playlist  = require('../model/playlist')
  , manager   = require('../playlist-manager')
// hacky way to get to resolved value of promise:
  , sc        = require('../soundcloud')._base.value
  , container = document.querySelector('section.add-tracks-form')
  , form      = container.querySelector('form')
  , table     = form.querySelector('table tbody')
  , input     = form.query

  , current, playlist, search, updateAddStatus, addButtons = {}
  , hiddenAddButtons = [];

playlist = new Playlist('Search tracks');

require('./playlist-list')(table, playlist, [
  ['Play', function () {
    this[this.playing ? 'stop' : 'play']();
  }, function (btn) {
    this.on('play', function () {
      btn.value = 'Stop';
    });
    this.on('stop', function () {
      btn.value = 'Play';
    });
  }], ['Add', function () {
    if (current) {
      current.insert(this);
    }
  }, function (dom) {
    addButtons[this._id] = dom;
    if (current.indexOf(this) >= 0) {
      dom.style.visibility  = 'hidden';
      hiddenAddButtons.push(dom);
    }
  }]
]);

updateAddStatus = function () {
  var btn;
  while ((btn = hiddenAddButtons.shift())) {
    btn.style.visibility = '';
  }
  if (current) {
    current.forEach(function (track) {
      if ((btn = addButtons[track._id])) {
        hiddenAddButtons.push(btn);
        btn.style.visibility = 'hidden';
      }
    });
  }
};

search = (function () {
  var current, query;

  // Cache query results for given phrase
  query = Function.memoize(function (value) {
    return value ?
        sc.get('/tracks', { filter: 'streamable', q: value, limit: 20 }) :
        deferred([]);
  });

  return function () {
    var value = input.value;
    if (value !== current) {
      query(current = value).end(function (data) {
        var l;
        if (value !== current) {
          // Do not populate results if search phrase already changed
          return;
        }
        while (playlist.length) {
          playlist.remove(playlist[0]);
        }
        data = data.map(function (data) {
          return new Track(data.id, data.title, data.user.username,
            data.stream_url + '?consumer_key=' + sc.key);
        });
        data.forEach(playlist.insert, playlist);
      }, null);
    }
  };
}());

form.onsubmit = function (e) {
  e.preventDefault();
  search();
};
input.onsearch = input.onchange = input.oninput = search;

manager.on('select', function (e) {
  if (current) {
    current.off('update', updateAddStatus);
    current = null;
  }
  if (e.target) {
    current = e.target;
    current.on('update', updateAddStatus);
  }
  updateAddStatus();
});

module.exports = function () {
  input.value = '';
  search();
  container.style.display = 'block';
  input.focus();
};
