// localStorage configuration

'use strict';

var parse     = JSON.parse
  , stringify = JSON.stringify
  , Playlist  = require('./model/playlist')
  , Track     = require('./model/track')
  , manager   = require('./playlist-manager')

  , savePlaylist;

savePlaylist = function (pls, e) {
  localStorage[pls._id] = stringify(pls);
  if (e && (e.action === 'insert')) {
    localStorage[e.target._id] = stringify(e.target);
  }
};

require('./soundcloud').end(function (sc) {
  // Prefix with 'u' as on IE .getItem won't work with numeric keys and
  // on Firefox getting values for such keys directly invokes error
  var data, id = 'u' + sc.user.id;

  // Save to DB
  manager.on('update', function (e) {
    var pls = e.target;
    if (e.action === 'insert') {
      savePlaylist(pls);
      pls.on('update', savePlaylist.partial(pls));
    } else if (e.action === 'remove') {
      delete localStorage[pls._id];
    }
    localStorage[id] = stringify(manager);
  });
  manager.on('select', function () {
    localStorage[id] = stringify(manager);
  });

  // Read from db
  data = localStorage.getItem(id);
  if (!data) {
    return;
  }
  data = parse(data);

  data.data.forEach(function (id) {
    var data = parse(localStorage.getItem(id));
    data.data.forEach(function (id) {
      Track.fromJSON(id, parse(localStorage.getItem(id)));
    });
    manager.insert(Playlist.fromJSON(id, data));
  });
  manager.select(data.selected);
}, null);
