'use strict';

module.exports = function (t, a) {
  var text = new t(' raz\ndwa '), node;

  a(String(text), ' raz\ndwa ', "toString");
  node = text.toDOM();
  a(node.nodeName, 'p', "toDOM: name");
  a(node.nodeType, 1, "toDOM: type");
  a(node.childNodes[0].data + node.childNodes[2].data, ' razdwa ',
    "toDOM: Content");
  a(node.childNodes[1].nodeName, 'br', 'toDOM: Line break');

  text.update('dwa\ntrzy');
  a(String(text), 'dwa\ntrzy', "Update");
  a(node.childNodes[0].data + node.childNodes[2].data, 'dwatrzy',
    "Update: toDOM: Content");
  a(node.childNodes[1].nodeName, 'br', 'Update: toDOM: Line break');
};
