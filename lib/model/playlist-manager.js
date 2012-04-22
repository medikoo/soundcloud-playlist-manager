// Playlist manager constructor

'use strict';

var pluck    = Function.pluck
  , isNumber = Number.isNumber
  , merge    = Object.merge
  , ee       = require('event-emitter')
  , Playlist = require('./playlist')

  , proto, importing;

proto = ee({
  insert: function (pls, index) {
    if (!isNumber(index)) {
      index = index ? this.indexOf(index) : this.length;
    }
    this.splice(index, 0, pls);
    this.emit('update', { target: this,
      undo: importing ? null : this.remove.bind(this, pls) });
  },
  remove: function (pls) {
    var index = this.indexOf(pls);
    if (index >= 0) {
      this.splice(index, 1);
      this.emit('update', { target: this,
        undo: this.insert.bind(this, pls, index) });
    }
  },
  toJSON: function () {
    return this.map(pluck('_id'));
  }
}, true, true);

exports = module.exports = function () {
  return merge([], proto);
};

exports.fromJSON = function (data) {
  importing = true;
  data = Object(data);
  var manager = exports();
  data.forEach(function (id) {
    var pls = Playlist.get(id);
    if (!pls) {
      throw new Error("Could not create Manager. "
        + "Playlist '" + id + "' not found.");
    }
    manager.insert(pls);
  });
  importing = false;
  return manager;
};
