// Playlist manager constructor

'use strict';

var pluck             = Function.pluck
  , merge             = Object.merge
  , ee                = require('event-emitter')
  , playingCollection = require('./playing-collection')
  , Playlist          = require('./playlist')

  , proto;

proto = merge(Object.copy(playingCollection), {
  toJSON: function () {
    return { selected: this.selected, data: this.map(pluck('_id')) };
  }
});

exports = module.exports = function () {
  return merge([], proto);
};

exports.fromJSON = function (data) {
  var manager = exports();
  data = Object(data);
  data.forEach(function (id) {
    var pls = Playlist.get(id);
    if (!pls) {
      throw new Error("Could not create Manager. "
        + "Playlist '" + id + "' not found.");
    }
    manager.insert(pls);
  });
  return manager;
};
