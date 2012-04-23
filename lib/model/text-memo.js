// TextMemo object constructor
// Use case: Multiline text

'use strict';

var Text = require('./text');

(module.exports = function (data) {
  Text.apply(this, arguments);
}).prototype = Object.merge(Object.create(Text.prototype), {
  toDOM: function () {
    var el;
    this._doms.push(el = document.createElement('p'));
    this._rebuildDOM(el);
    return el;
  },
  _rebuildDOM: function (dom) {
    var data;
    while (dom.firstChild) {
      dom.removeChild(dom.firstChild);
    }
    if (this._data.length) {
      data = this._data.split('\n');
      dom.appendChild(document.createTextNode(data.shift()));
      data.forEach(function (data) {
        dom.appendChild(document.createElement('br'));
        dom.appendChild(document.createTextNode(data));
      });
    }
  }
});
