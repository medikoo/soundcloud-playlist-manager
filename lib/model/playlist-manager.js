// Playlist manager constructor

'use strict';

var pluck             = Function.pluck
  , extend            = Object.extend
  , ee                = require('event-emitter')
  , playingCollection = require('./playing-collection')
  , Playlist          = require('./playlist')

  , proto, Manager;

// Each instance is an Array, it's the reason we don't
// build inheritance chain here, but just extend flat objects
proto = extend(Object.copy(playingCollection), {
  toJSON: function () {
    return { selected: this.selected, data: this.map(pluck('_id')) };
  }
});

Manager = module.exports = function () {
  return extend([], proto);
};

Manager.fromJSON = function (data) {
  var manager = new Manager();
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
