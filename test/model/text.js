'use strict';

module.exports = function (t, a) {
  var text = new t(' raz '), node;

  a(String(text), ' raz ', 'toString');
  a(text.trim(), 'raz', 'Inherits from String.prototype');
  node = text.toDOM();
  a(node.nodeType, 3, "toDOM");
  a(node.data, ' raz ', "DOM content");

  text.update('dwa');
  a(String(text), 'dwa', 'Update');
  a(node.data, 'dwa', 'DOM update');
};
