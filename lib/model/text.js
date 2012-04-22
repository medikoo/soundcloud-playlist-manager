// Text object constructor

'use strict';

(module.exports = function (data) {
  this._doms = [];
  this.update(data || '');
}).prototype = Object.merge(Object.create(String.prototype), {
  update: function (data) {
    data = String(data);
    if (data !== this._data) {
      this._data = data;
      this._doms.forEach(function (dom) {
        dom.data = data;
      });
    }
  },
  toString: function () {
    return this._data;
  },
  toDOM: function () {
    var dom = document.createTextNode(this._data);
    this._doms.push(dom);
    return dom;
  }
});
