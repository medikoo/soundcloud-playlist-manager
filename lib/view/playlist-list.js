// Tracklist of Playlist view
// Used by search and playlist view

'use strict';

var el        = require('../util/create-element')

  , buildActions, buildTrack;

// Setups action buttons
buildActions = function (dom, track, actions) {
  actions.forEach(function (data) {
    var btn, label = data[0]
      , value = data[1]
      , conf = data[2];

    btn = dom.appendChild(el('input', { type: 'button', value: label,
      onclick: function (e) {
        e.stopPropagation();
        value.call(track);
      } }));
    if (conf) {
      conf.call(track, btn);
    }
    dom.appendChild(document.createTextNode(' '));
  });
  return dom;
};

// Builds HTML for track
buildTrack = function (track, pls, actions) {
  var dom;
  dom = el('tr', el('td', track.title), el('td', track.user),
    buildActions(el('td'), track, actions));

  dom.onclick = function () {
    pls.select(track);
    if (pls.indexOf(track) === pls.playing) {
      track.stop(pls);
    } else {
      track.play(pls);
    }
  };
  track.on('play', function (e) {
    if (e.target === pls) {
      dom.classList.add('playing');
    }
  });
  track.on('stop', function () {
    dom.classList.remove('playing');
  });
  return dom;
};

module.exports = function (table, pls, actions) {
  var getTrack, update, running, selected;

  // Get track HTML (created once, reuse)
  getTrack = function (track) {
    return buildTrack(track, pls, actions);
  }.memoize();

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

  // Update tracklist (after add, remove or reorder)
  update = (function () {
    var scheduled, update;
    update = function () {
      scheduled = false;
      pls.forEach(function (track) {
        table.appendChild(getTrack(track));
      });
      while (table.childNodes.length > pls.length) {
        table.removeChild(table.firstChild);
      }
    };

    return function () {
      if (!scheduled) {
        setTimeout(update, 0);
        scheduled = true;
      }
    };
  }());

  update();
  pls.on('update', update);
};
