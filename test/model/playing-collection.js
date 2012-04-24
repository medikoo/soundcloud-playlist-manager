'use strict';

var i    = require('es5-ext/lib/function/i')
  , noop = Function.noop;

module.exports = function (t, a) {
  var col = Object.merge([], t), node, json, invoked, history
    , x = { _id: 'x', play: noop }, y = { _id: 'y', play: noop }
    , z = { _id: 'z', play: noop }, w = { _id: 'w', play: noop };

  col.insert(x);
  a(col.length, 1, "Insert: length");
  a.deep(col.map(i), [x], "Insert: content");

  col.insert(y);
  a(col.length, 2, "Insert #2: length");
  a.deep(col.map(i), [x, y], "Insert #2: content");

  col.once('update', function (e) {
    invoked = true;
    a.deep(col.map(i), [x, z, y], "Insert at index: content");

    a(e.target, z, "Emit: insert: target");
    history = e.history();
    history.undo();
    a.deep(col.map(i), [x, y], "Emit: insert: undo");
    history.redo();
  });
  col.insert(z, 1);
  a(invoked, true, "Emit: insert");

  col.insert(w, y);
  a.deep(col.map(i), [x, z, w, y], "Insert before item");

  col.insert(y);
  a.deep(col.map(i), [x, z, w, y], "Insert duplicate");

  invoked = false;
  col.once('update', function (e) {
    invoked = true;
    a(col.length, 3, "Remove: length");
    a.deep(col.map(i), [x, z, y], "Remove: content");

    a(e.target, w, "Emit: remove: target");
    history = e.history();
    history.undo();
    a.deep(col.map(i), [x, z, w, y], "Emit: remove: undo");
    history.redo();
  });
  col.remove(w);
  a(invoked, true, "Emit: remove");

  a(col.getIndex(23), null, "Get Index: Out of bounds");
  a(col.getIndex(2), 2, "Get Index: self");
  a(col.getIndex(x), 0, "Get Index: item");

  a(col.selected, null, "Initial Select");
  invoked = false;
  col.once('select', function (e) {
    invoked = true;
    a(e.target, z, "Emit: select: target");
    a(col.selected, 1, "Select");
  });
  col.select(z);
  a(invoked, true, "Emit: select");

  col.on('select', a.never);
  col.select(z);
  col.off('select', a.never);

  col.select(2);
  a(col.selected, 2, "Select: index");

  col.select();
  a(col.selected, null, "Deselect");

  a(col.playing, null, "Initial Play");
  invoked = false;
  col.once('play', function (e) {
    invoked = true;
    a(e.target, x, "Emit: play: target");
    a(col.playing, 0, "Play: no index");
  });
  col.play();
  a(invoked, true, "Emit: play");

  col.on('select', a.never);
  col.play(x);
  col.off('select', a.never);

  col.play(2);
  a(col.playing, 2, "Play: index");

  col.play(z);
  a(col.playing, 1, "Play: item");

  invoked = false;
  col.once('stop', function (e) {
    invoked = true;
    a(e.target, z, "Emit: stop: target");
    a(col.playing, null, "Stop");
  });
  col.stop();
  a(invoked, true, "Emit: stop");

  col.on('stop', a.never);
  col.stop();
  col.off('stop', a.never);
};
