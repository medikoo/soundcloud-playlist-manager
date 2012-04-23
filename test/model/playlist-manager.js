'use strict';

var i        = require('es5-ext/lib/function/i')
  , Playlist = require('../../lib/model/playlist');

module.exports = function (t, a) {
  var manager, x, y, z, w, invoked, json;

  manager = new t();
  x = new Playlist('', '', 'x');
  y = new Playlist('', '', 'y');
  z = new Playlist('', '', 'z');
  w = new Playlist('', '', 'w');

  a(Array.isArray(manager), true, "Is Array");

  manager.insert(x);
  manager.insert(z);
  manager.insert(y);

  json = manager.toJSON();
  a.deep(json, ['x', 'z', 'y'], "toJSON");

  a.deep(t.fromJSON(['w', 'y']).map(i), [w, y], "fromJSON");
};
