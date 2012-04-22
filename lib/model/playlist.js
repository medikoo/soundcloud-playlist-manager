// Playlist constructor

'use strict';

var pluck    = Function.pluck
  , isNumber = Number.isNumber
  , merge    = Object.merge
  , guid     = require('es5-ext/lib/guid')
  , ee       = require('event-emitter')
  , Text     = require('./text')

  , proto, importing;

proto = ee({
  insert: function (track, index) {
    if (this.indexOf(track) >= 0) {
      // Prevent duplicates
      return;
    }
    if (!isNumber(index)) {
      // Insert before track
      index = index ? this.indexOf(index) : this.length;
    }
    this.splice(index, 0, track);
    this.emit('update', { target: this,
      undo: importing ? null : this.remove.bind(this, track) });
  },
  remove: function (track) {
    var index = this.indexOf(track);
    if (index >= 0) {
      this.splice(index, 1);
      this.emit('update', { target: this,
        undo: this.insert.bind(this, track, index) });
    }
  },
  toDOM: function () {
    return this.title.toDOM();
  },
  toJSON: function () {
    return {
      title: String(this.title),
      description: String(this.description),
      data: this.map(pluck('_id'))
    };
  }
}, true, true);

exports = module.exports = function (title, description, id) {
  return merge(merge([], proto), {
    _id: id || guid(),
    title: new Text(title),
    description: new Text(description || '')
  });
};

exports.fromJSON = function (id, data) {
  importing = true;
  data = Object(data);
  var playlist = exports(data.title, data.description, String(id));
  data.data.forEach(function (id) {
    playlist.insert({ _id: id });
  });
  importing = false;
  return playlist;
};
