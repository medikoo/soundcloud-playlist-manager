// Playlist view

'use strict';

var memoize = Function.memoize
  , el      = require('../util/create-element')
  , manager = require('../playlist-manager')
  , form    = require('./playlist-form')

  , playStop, previous, next, update, populate, select, remove, deletePl;

// Play/Stop controller
playStop = function (track) {
  this[(this.playing == null) ? 'play' : 'stop'](track);
};

// Play Next controller
next = function () {
  this.play((this.playing == null) ? null : this.playing + 1);
};

// Play Previous controller
previous = function () {
  this.play((this.playing == null) ? null : this.playing - 1);
};

// Updates widget state
update = function (playStop, next, previous, noticeEmpty) {
  if (!this.length) {
    playStop.disabled = next.disabled = previous.disabled = true;
    noticeEmpty.style.display = '';
    return;
  }
  noticeEmpty.style.display = 'none';
  playStop.disabled = false;
  next.disabled = (this.playing === (this.length - 1));
  previous.disabled = (this.playing === 0);
  playStop.value = (this.playing == null) ? 'Play' : 'Stop';
};

// Select track controller
select = function (track) {
  this.select(track);
};

// Remove track controller
remove = function (track) {
  this.remove(track);
};

// Delete playlist controller
deletePl = function () {
  if (confirm("Are you sure?")) {
    manager.remove(this);
  }
};

// Populates playlist  with tracks
populate = function (pls, table) {
  var selected, playing, update, getTrack;

  // get track view (create once, reuse)
  getTrack = memoize(function (track) {
    var tr, playStopBtn;
    tr = el('tr',
      el('td', el('a', { onclick: select.bind(pls, track) }, track.toDOM())),
      el('td', el('input',
        { type: 'button', value: 'Remove', onclick: remove.bind(pls, track) })),
      el('td', playStopBtn = el('input', { type: 'button', value: 'Play',
          onclick: playStop.bind(pls, track) })));
    tr.playStopBtn = playStopBtn;
    return tr;
  });

  // Update tracklist (after add, remove or reorder)
  update = function () {
    var l = table.length;
    pls.forEach(function (track) {
      table.appendChild(getTrack(track));
    });
    while (l > table.childNodes.length) {
      table.removeChild(table.firstChild);
    }
  };

  pls.on('update', update);

  // Handle track selection
  pls.on('select', function (e) {
    if (selected) {
      selected.classList.remove('selected');
      selected = null;
    }
    if (e.target) {
      selected = getTrack(e.target);
      selected.classList.add('selected');
    }
  });

  // Handle playlist play/stop
  pls.on('play', function (e) {
    if (playing) {
      playing.classList.remove('playing');
      playing.playStopBtn.value = 'Play';
    }
    playing = getTrack(e.target);
    playing.classList.add('playing');
    playing.playStopBtn.value = 'Stop';
  });
  pls.on('stop', function () {
    playing.classList.remove('playing');
    playing = null;
  });
};

module.exports = memoize(function (pls) {
  var container, title, description, playStopBtn, nextBtn, previousBtn
    , updatePls, table, noticeEmpty;

  // Build Playlist view
  container = el('section', { 'class': 'playlist' },
      el('header',
        el('div',
          el('h2', pls.title.toDOM()),
          el('div', { 'class': 'controls' },
            previousBtn = el('input', { 'type': 'button', value: '<',
              onclick: previous.bind(pls) }), ' ',
            playStopBtn = el('input', { 'type': 'button', value: 'Play',
              onclick: playStop.bind(pls, null) }), ' ',
            nextBtn = el('input', { 'type': 'button', value: '>',
              onclick: next.bind(pls) }))),
        pls.description.toDOM(),
        el('p', { 'class': 'edit' },
          el('input', { type: 'button', value: 'Edit',
            onclick: form.partial(pls) }), ' ',
          el('input', { type: 'button', value: 'Remove',
            onclick: deletePl.bind(pls) }))),
    noticeEmpty = el('p', { 'class': 'no-tracks' }, "No Tracks"),
    table = el('table'));

  // Update state of the buttons and messages
  updatePls = update.bind(pls, playStopBtn, nextBtn, previousBtn, noticeEmpty);
  updatePls();

  // Schedule state updates
  pls.on('update', updatePls);
  pls.on('play', updatePls);
  pls.on('stop', updatePls);

  // Populate playlist with tracks
  populate(pls, table);

  return container;
});
