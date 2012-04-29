// History constructor

'use strict';

var assertNotNull  = require('es5-ext/lib/assert-not-null')
  , assertCallable = require('es5-ext/lib/Object/assert-callable')
  , ee             = require('event-emitter');

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
    assertNotNull(actions) && assertCallable(actions.undo) &&
      assertCallable(actions.redo);
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
