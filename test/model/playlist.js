'use strict';

var i = require('es5-ext/lib/function/i');

module.exports = function (t, a) {
  var playlist = new t('Title', 'Description'), node, json, invoked
    , x = { _id: 'x' }, y = { _id: 'y' }, z = { _id: 'z' }, w = { _id: 'w' };

  a(Array.isArray(playlist), true, "Is Array");
  a(String(playlist.title), 'Title', "Title");
  a(String(playlist.description), 'Description', "Description");
  a(typeof playlist._id, 'string', "Id");
  a(String(playlist), 'Title', "toString");

  playlist.insert(x);
  a(playlist.length, 1, "Insert: length");
  a.deep(playlist.map(i), [x], "Insert: content");

  playlist.insert(y);
  a(playlist.length, 2, "Insert #2: length");
  a.deep(playlist.map(i), [x, y], "Insert #2: content");

  playlist.once('update', function (e) {
    invoked = true;
    a.deep(playlist.map(i), [x, z, y], "Insert at index: content");

    a(e.target, playlist, "Emit: insert: target");
    e.undo();
    a.deep(playlist.map(i), [x, y], "Emit: insert: undo");
    playlist.insert(z, 1);
  });
  playlist.insert(z, 1);
  a(invoked, true, "Emit: insert");

  playlist.insert(w, y);
  a.deep(playlist.map(i), [x, z, w, y], "Insert before track");

  playlist.insert(y);
  a.deep(playlist.map(i), [x, z, w, y], "Insert duplicate");

  invoked = false;
  playlist.once('update', function (e) {
    invoked = true;
    a(playlist.length, 3, "Remove: length");
    a.deep(playlist.map(i), [x, z, y], "Remove: content");

    a(e.target, playlist, "Emit: remove: target");
    e.undo();
    a.deep(playlist.map(i), [x, z, w, y], "Emit: remove: undo");
    playlist.remove(w);
  });
  playlist.remove(w);
  a(invoked, true, "Emit: remove");

  node = playlist.toDOM();
  a(node.nodeType, 3, "toDOM");
  a(node.data, 'Title', "DOM content");

  json = playlist.toJSON();
  a.deep(json.data, ['x', 'z', 'y'], "toJSON: data");
  delete json.data;
  a.deep(json, { title: 'Title', description: 'Description' }, "toJSON: rest");

  playlist = t.fromJSON('pid', json = {
    title: 'TestTitle',
    description: 'TestDescription',
    data: ['a', 'b', 'd']
  });

  a(String(playlist._id), 'pid', "fromJSON: id");
  a(String(playlist.title), 'TestTitle', "fromJSON: title");
  a(String(playlist.description), 'TestDescription', "fromJSON: description");
  a.deep(playlist.map(Function.pluck('_id')), ['a', 'b', 'd'],
    "fromJSON: data");

  a(t.get('pid'), playlist, "get");
};
