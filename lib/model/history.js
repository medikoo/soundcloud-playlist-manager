// History constructor

'use strict';

var assertCallable = require('es5-ext/lib/Object/assert-callable')
  , ee             = require('event-emitter');

(module.exports = function () {
  this._actions = [];
}).prototype = ee({
  _current: 0,
  add: function (undo, redo) {
    assertCallable(undo) && assertCallable(redo);
    if (this._current < this._actions.length) {
      this._actions.splice(this._current, Infinity);
    }
    this._actions.push([undo, redo]);
    ++this._current;
    this.emit('update',
      { length: this._actions.length, current: this._current });
  },
  back: function () {
    if (this._current) {
      this._actions[--this._current][0]();
      this.emit('update',
        { length: this._actions.length, current: this._current });
    }
  },
  forward: function () {
    if (this._current < this._actions.length) {
      this._actions[this._current++][1]();
      this.emit('update',
        { length: this._actions.length, current: this._current });
    }
  }
}, true, true);
