// History constructor

'use strict';

var value    = require('es5-ext/lib/Object/valid-value')
  , callable = require('es5-ext/lib/Object/valid-callable')
  , ee       = require('event-emitter');

(module.exports = function () {
  this._actions = [];
}).prototype = ee({
  _current: 0,
  _inRevert: false,

  // Append to history
  add: function (actions) {
    if (this._inRevert) {
      return;
    }
    value(actions);
    callable(actions.undo) && callable(actions.redo);
    if (this._current < this._actions.length) {
      this._actions.splice(this._current, Infinity);
    }
    this._actions.push(actions);
    ++this._current;
    this.emit('update',
      { length: this._actions.length, current: this._current });
  },

  // Revert given action
  _revert: function (action) {
    this._inRevert = true;
    action();
    this._inRevert = false;
  },

  // Go back
  back: function () {
    if (this._current) {
      this._revert(this._actions[--this._current].undo);
      this.emit('update',
        { length: this._actions.length, current: this._current });
    }
  },

  // Go forward
  forward: function () {
    if (this._current < this._actions.length) {
      this._revert(this._actions[this._current++].redo);
      this.emit('update',
        { length: this._actions.length, current: this._current });
    }
  }
}, true, true);
