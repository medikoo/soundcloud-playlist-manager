// Playlist constructor

'use strict';

var pluck             = Function.pluck
  , extend            = Object.extend
  , guid              = require('es5-ext/lib/String/guid')
  , Text              = require('./text')
  , TextMemo          = require('./text-memo')
  , Track             = require('./track')
  , playingCollection = require('./playing-collection')

  , proto, objects = {}, Playlist;

// Playlist specific methods
// Each instance is an Array, it's the reason we don't
// build inheritance chain here, but just extend flat objects
proto = extend(Object.copy(playingCollection), {
  update: function (title, description) {
    var otitle, odesc;
    if ((this.title._data === title) &&
        (this.description.data === description)) {
      // No changes
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

// Create playlist
Playlist = module.exports = function (title, description, id) {
  id = ((id == null) ? guid() : String(id));
  return (objects[id] = extend(extend([], proto), {
    _id: id,
    title: new Text(title),
    description: new TextMemo(description || '')
  }));
};

// Get playlist by id
Playlist.get = function (id) {
  return objects[id] || null;
};

// Create playlist from JSON
Playlist.fromJSON = function (id, data) {
  data = Object(data);
  var playlist = new Playlist(data.title, data.description, String(id));
  data.data.forEach(function (id) {
    var track = Track.get(id);
    if (!track) {
      throw new Error("Could not create Playlist. "
        + "Track '" + id + "' not found.");
    }
    playlist.insert(track);
  });
  return playlist;
};
