// Playlist view

'use strict';

var max           = Math.max
  , min           = Math.min
  , memoize       = Function.memoize
  , el            = require('../util/create-element')
  , manager       = require('../playlist-manager')
  , form          = require('./playlist-form')
  , playlistList  = require('./playlist-list')
  , addTracksForm = require('./add-tracks-form')

  , playStop, previous, next, update, populate, select, remove, deletePl;

// Play/Stop controller
playStop = function () {
  if (this.length) {
    this[(this.playing == null) ? 'play' : 'stop'](this.selected);
  }
};

// Play Next controller
next = function () {
  var next;
  if (this.length && (this.playing !== (this.length - 1))) {
    if (this.playing == null) {
      next = (this.selected == null) ? null :
          min(this.selected + 1, this.length - 1);
    } else {
      next = this.playing + 1;
    }
    this.select(next);
    this.play(next);
  }
};

// Play Previous controller
previous = function () {
  var previous;
  if (this.length && (this.playing !== 0)) {
    if (this.playing == null) {
      previous = (this.selected == null) ? null : max(this.selected - 1, 0);
    } else {
      previous = this.playing - 1;
    }
    this.select(previous);
    this.play(previous);
  }
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

// Delete playlist controller
deletePl = function () {
  if (confirm("Are you sure?")) {
    manager.remove(this);
  }
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
            el('input', { 'class': 'add-tracks', type: 'button',
              value: 'Add tracks', onclick: addTracksForm }), ' ',
            previousBtn = el('input', { 'type': 'button', value: '<',
              onclick: previous.bind(pls) }), ' ',
            playStopBtn = el('input', { 'type': 'button', value: 'Play',
              onclick: playStop.bind(pls) }), ' ',
            nextBtn = el('input', { 'type': 'button', value: '>',
              onclick: next.bind(pls) }))),
        pls.description.toDOM(),
        el('p', { 'class': 'edit' },
          el('input', { type: 'button', value: 'Edit',
            onclick: form.partial(pls) }), ' ',
          el('input', { type: 'button', value: 'Remove',
            onclick: deletePl.bind(pls) }))),
    noticeEmpty = el('p', { 'class': 'no-tracks' }, "No Tracks"),
    el('div', { 'class': 'table' }, el('table',
      table = el('tbody', { 'class': 'tracks' }))));

  // Update state of the buttons and messages
  updatePls = update.bind(pls, playStopBtn, nextBtn, previousBtn, noticeEmpty);
  updatePls();

  // Schedule state updates
  pls.on('update', updatePls);
  pls.on('play', updatePls);
  pls.on('stop', function (e) {
    var index, next;
    if (!e.forced) {
      // Let all stop observers propagate before we invoke next actions
      if ((index = this.indexOf(e.target)) !== (this.length - 1)) {
        // Finished playing track, play next
        setTimeout(function () {
          pls.select(index + 1);
          pls.play(index + 1);
        }, 0);
        return;
      } else {
        // Finished playing last track, select first
        setTimeout(function () {
          pls.select(0);
        }, 0);
      }
    }
    updatePls();
  });

  // Populate playlist list
  playlistList(table, pls, [
    ['Remove', function () {
      pls.remove(this);
    }],
    ['Play', function () {
      pls.select(this);
      this[(this.playing && (pls.playing != null)) ? 'stop' : 'play'](pls);
    }, function (btn) {
      this.on('play', function (e) {
        if (e.target === pls) {
          btn.value = 'Stop';
        }
      });
      this.on('stop', function (e) {
        if (e.target === pls) {
          btn.value = 'Play';
        }
      });
    }]
  ]);

  return container;
});
