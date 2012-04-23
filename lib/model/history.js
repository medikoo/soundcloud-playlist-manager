// History constructor

'use strict';

(module.exports = function () {
  this._actions = [];
}).prototype = {
  _current: 0,
  add: function (undo, redo) {
    if (this._current < this._actions.length) {
      this._actions.splice(this._current, Infinity);
    }
    this._actions.push([undo, redo]);
    ++this._current;
  },
  back: function () {
    if (this._current) {
      this._actions[--this._current][0]();
    }
  },
  forward: function () {
    if (this._current < this._actions.length) {
      this._actions[this._current++][1]();
    }
  }
};
