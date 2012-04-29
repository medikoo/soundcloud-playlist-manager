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
  Track.emit('play', { target: (playing.track = track), playlist: playlist });
  return true;
};

// Stop currently playing track
stop = function (track, playlist, forced) {
  if ((playing.track === track) && (playing.playlist === playlist)) {
    playing.track.playing = false;
    Track.emit('stop',
      { target: playing.track, playlist: playlist, forced: forced });
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
    if (!playlist) {
      playlist = playing.playlist;
    }
    if (play(this, playlist)) {
      this.emit('play', { target: playlist });
    }
  },

  // To be used only by player implementation
  // with this method we inform internal implementation
  // that track has finished playing
  _onfinish: function (playlist) {
    if (stop(this, playlist, false)) {
      this.emit('stop', { target: playlist, forced: false });
    }
  },
  stop: function (playlist) {
    if (stop(this, playlist, true)) {
      this.emit('stop', { target: playlist, forced: true });
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
