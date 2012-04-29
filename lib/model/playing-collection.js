// Abstraction common for PlaylistManager and Playlist objects

'use strict';

var isNumber   = Number.isNumber
  , toUinteger = Number.toUinteger
  , ee         = require('event-emitter');

module.exports = ee({
  selected: null,
  playing: null,
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
    this.splice(index, 0, item);
    this.emit('update', { target: item, action: 'insert', history: function () {
      return { undo: this.remove.bind(this, item),
        redo: this.insert.bind(this, item, index) };
    }.bind(this) });
  },
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
      this.emit('update', { target: item, action: 'remove',
        history: function () {
          return { undo: this.insert.bind(this, item, index),
            redo: this.remove.bind(this, item) };
        }.bind(this) });
    }
  },
  getIndex: function (item) {
    var index;
    if (!this.length || (item == null)) {
      return null;
    }
    if (isNumber(item)) {
      index = toUinteger(item);
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
  play: function (item) {
    var index = this.getIndex(item);
    if (index == null) {
      // Play first if no item is playing
      if ((this.playing !== null) || !this.length) {
        return;
      }
      index = 0;
    }
    if (index !== this.playing) {
      this[this.playing = index].play();
      this.emit('play', { target: this[index] });
    }
  },
  stop: function () {
    var target;
    if (this.playing) {
      target = this[this.playing];
      this.playing = null;
      this.emit('stop', { target: target });
    }
  }
}, true, true);
