'use strict';

var i = require('es5-ext/lib/function/i');

module.exports = function (t, a) {
  var playlist = new t('Title', 'Description'), node, json, invoked, history
    , x = { _id: 'x' }, y = { _id: 'y' }, z = { _id: 'z' };

  a(Array.isArray(playlist), true, "Is Array");
  a(String(playlist.title), 'Title', "Title");
  a(String(playlist.description), 'Description', "Description");
  a(typeof playlist._id, 'string', "Id");
  a(String(playlist), 'Title', "toString");

  playlist.insert(x);
  playlist.insert(z);
  playlist.insert(y);

  playlist.once('update', function (e) {
    invoked = true;
    a.deep([String(playlist.title), String(playlist.description)],
      ['New T', 'New D'], "Emit: update: title");
    history = e.history();
    history.undo();
    a.deep([String(playlist.title), String(playlist.description)],
      ['Title', 'Description'], "Emit: update: undo");
    history.redo();
  });
  playlist.update('New T', 'New D');
  a(invoked, true, "Emit: update");

  node = playlist.toDOM();
  a(node.nodeType, 3, "toDOM");
  a(node.data, 'New T', "DOM content");

  json = JSON.parse(JSON.stringify(playlist));
  a.deep(json.data, ['x', 'z', 'y'], "toJSON: data");
  delete json.data;
  a.deep(json, { title: 'New T', description: 'New D' }, "toJSON: rest");

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
