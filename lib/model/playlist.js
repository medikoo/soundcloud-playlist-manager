// Playlist constructor

'use strict';

var pluck             = Function.pluck
  , merge             = Object.merge
  , guid              = require('es5-ext/lib/guid')
  , Text              = require('./text')
  , playingCollection = require('./playing-collection')

  , proto, objects = {};

proto = merge(Object.copy(playingCollection), {
  update: function (title, description) {
    var otitle, odesc;
    if ((this.title._data === title) &&
        (this.description.data === description)) {
      return;
    }
    otitle = this.title._data;
    odesc = this.description._data;
    this.title.update(title);
    this.description.update(description);
    this.emit('update', { target: this, action: 'update',
      history: function () {
        return { undo: this.update.bind(this, otitle, odesc),
          redo: this.update.bind(this, title, description) };
      }.bind(this) });
  },
  toString: function () {
    return String(this.title);
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
});

exports = module.exports = function (title, description, id) {
  id = ((id == null) ? guid() : String(id));
  return (objects[id] = merge(merge([], proto), {
    _id: id,
    title: new Text(title),
    description: new Text(description || '')
  }));
};

exports.get = function (id) {
  return objects[id] || null;
};

exports.fromJSON = function (id, data) {
  data = Object(data);
  var playlist = exports(data.title, data.description, String(id));
  data.data.forEach(function (id) {
    playlist.insert({ _id: id });
  });
  return playlist;
};
