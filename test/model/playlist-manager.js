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
  a(manager.length, 1, "Insert: length");
  a.deep(manager.map(i), [x], "Insert: content");

  manager.insert(y);
  a(manager.length, 2, "Insert #2: length");
  a.deep(manager.map(i), [x, y], "Insert #2: content");

  manager.once('update', function (e) {
    invoked = true;
    a.deep(manager.map(i), [x, z, y], "Insert at index: content");

    a(e.target, manager, "Emit: insert: target");
    e.undo();
    a.deep(manager.map(i), [x, y], "Emit: insert: undo");
    manager.insert(z, 1);
  });
  manager.insert(z, 1);
  a(invoked, true, "Emit: insert");

  manager.insert(w, y);
  a.deep(manager.map(i), [x, z, w, y], "Insert before playlist");

  invoked = false;
  manager.once('update', function (e) {
    invoked = true;
    a(manager.length, 3, "Remove: length");
    a.deep(manager.map(i), [x, z, y], "Remove: content");

    a(e.target, manager, "Emit: remove: target");
    e.undo();
    a.deep(manager.map(i), [x, z, w, y], "Emit: remove: undo");
    manager.remove(w);
  });
  manager.remove(w);
  a(invoked, true, "Emit: remove");

  json = manager.toJSON();
  a.deep(json, ['x', 'z', 'y'], "toJSON");

  a.deep(t.fromJSON(['w', 'y']).map(i), [w, y], "fromJSON");
};
