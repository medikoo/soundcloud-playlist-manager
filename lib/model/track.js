// Track constructor
// We take care about play/stop logic globally, we don't want to have
// tracks playing simultaneously

'use strict';

var ee = require('event-emitter')

  , play, stop, playing, objects = {}, Track;

// Play track
play = function (track) {
  if (playing) {
    // Stop currently playing track if there is one
    if (track === playing) {
      // Given track is playing, therefore no action
      return false;
    }
    playing.stop();
  }
  track.playing = true;
  Track.emit('play', { target: (playing = track) });
  return true;
};

// Stop currently playing track
stop = function (track) {
  if (playing === track) {
    playing.playing = false;
    Track.emit('stop', { target: playing });
    playing = null;
    return true;
  }
  return false;
};

Track = ee(function (id, title, user, url) {
  if (objects[id]) {
    return objects[id];
  }
  objects[id] = this;
  this._id = id;
  this.title = title;
  this.user = user;
  this.url = url;
}, true, true);

Track.prototype = ee({
  playing: false,
  play: function () {
    if (play(this)) {
      this.emit('play');
    }
  },
  stop: function () {
    if (stop(this)) {
      this.emit('stop');
    }
  },
  toJSON: function () {
    return { title: this.title, user: this.user, url: this.url };
  }
}, true, true);

Track.get = function (id) {
  return objects[id] || null;
};

Track.fromJSON = function (id, data) {
  return new Track(id, data.title, data.user, data.url);
};

module.exports = Track;
