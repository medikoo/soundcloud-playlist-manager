// PlayingCollection: abstraction for PlaylistManager and Playlist objects

'use strict';

var isNumber = Number.isNumber
  , toUint   = Number.toUint
  , ee       = require('event-emitter')

  , onitemplay, onitemstop;

onitemplay = function (item, e) {
  if (e.target === this) {
    this.playing = this.indexOf(item);
    this.emit('play', { target: item });
  }
};

onitemstop = function (item, e) {
  if (e.target === this) {
    this.playing = null;
    this.emit('stop', { target: item, forced: e.forced });
  }
};

module.exports = ee({
  selected: null,
  playing: null,

  // Insert item in collection
  insert: function (item, index) {
    if (this.indexOf(item) >= 0) {
      // Prevent duplicates
      return;
    }
    index = this.getIndex(index);
    if (!isNumber(index)) {
      // Insert before item
      index = this.length;
    }
    // Add item
    this.splice(index, 0, item);

    // Add observers
    item.on('play', this[item._id + '.onplay'] = onitemplay.bind(this, item));
    item.on('stop', this[item._id + '.onstop'] = onitemstop.bind(this, item));

    this.emit('update', { target: item, action: 'insert', history: function () {
      return { undo: this.remove.bind(this, item),
        redo: this.insert.bind(this, item, index) };
    }.bind(this) });
  },

  // Remove item from collection
  remove: function (item) {
    var index = this.indexOf(item);
    if (index >= 0) {
      if (this.selected === index) {
        this.select(null);
      }
      if (this.playing === index) {
        this.stop();
      }
      this.splice(index, 1);

      // Remove observers
      item.off('play', this[item._id + '.onplay']);
      delete this[item._id + '.onplay'];
      item.off('stop', this[item._id + '.onstop']);
      delete this[item._id + '.onstop'];

      this.emit('update', { target: item, action: 'remove',
        history: function () {
          return { undo: this.insert.bind(this, item, index),
            redo: this.remove.bind(this, item) };
        }.bind(this) });
    }
  },

  // getIndex of item (given item might be item itself or index)
  getIndex: function (item) {
    var index;
    if (!this.length || (item == null)) {
      return null;
    }
    if (isNumber(item)) {
      index = toUint(item);
      if (index >= this.length) {
        return null;
      }
    } else {
      index = this.indexOf(item);
      if (index < 0) {
        return null;
      }
    }
    return index;
  },

  // Select item in collection
  select: function (item) {
    var index;
    if (item == null) {
      index = null;
    } else if ((index = this.getIndex(item)) === null) {
      // wrong index
      return;
    }
    if (this.selected !== index) {
      this.selected = index;
      this.emit('select',
        { target: (this.selected == null) ? null : this[this.selected] });
    }
  },

  // Play collection item
  play: function (item) {
    var index = this.getIndex(item);
    if (index == null) {
      // Play first if no item is playing
      if ((this.playing != null) || !this.length) {
        return;
      }
      index = 0;
    }
    if (index !== this.playing) {
      this[index].play(this);
    }
  },

  // Stop playing
  stop: function () {
    var target;
    if (this.playing != null) {
      this[this.playing].stop(this);
    }
  }
}, true, true);
