// Track constructor
// We take care about play/stop logic globally, we don't want to have
// tracks playing simultaneously

'use strict';

var ee = require('event-emitter')

  , play, stop, playing = {}, objects = {}, Track;

// Play track
play = function (track, playlist) {
  if (playing.track) {
    // Stop currently playing track if there is one
    if ((track === playing.track) && (playlist === playing.playlist)) {
      // Given track is playing, therefore no action
      return false;
    }
    playing.track.stop(playing.playlist);
  }
  track.playing = true;
  playing.playlist = playlist;
  Track.emit('play', { target: (playing.track = track) });
  return true;
};

// Stop currently playing track
stop = function (track, playlist) {
  if ((playing.track === track) && (playing.playlist === playlist)) {
    playing.track.playing = false;
    Track.emit('stop', { target: playing.track });
    playing.track = null;
    playing.playlist = null;
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
  play: function (playlist) {
    if (play(this, playlist)) {
      this.emit('play', { target: playlist });
    }
  },
  stop: function (playlist) {
    if (stop(this, playlist)) {
      this.emit('stop', { target: playlist });
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
