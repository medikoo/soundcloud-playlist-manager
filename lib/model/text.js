// Text object constructor
// Use case: Single line phrases

'use strict';

(module.exports = function (data) {
  this._doms = [];
  this.update(data || '');
}).prototype = Object.merge(Object.create(String.prototype), {
  update: function (data) {
    data = String(data);
    if (data !== this._data) {
      this._data = data;
      this._doms.forEach(this._rebuildDOM, this);
    }
  },
  toString: function () {
    return this._data;
  },
  toDOM: function () {
    var dom = document.createTextNode(this._data);
    this._doms.push(dom);
    return dom;
  },
  _rebuildDOM: function (dom) {
    dom.data = this._data;
  }
});
