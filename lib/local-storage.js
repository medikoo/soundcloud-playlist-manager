'use strict';

var parse     = JSON.parse
  , stringify = JSON.stringify
  , Playlist  = require('./model/playlist')
  , manager   = require('./playlist-manager')

  , savePlaylist;

savePlaylist = function (pls) {
  localStorage[pls._id] = stringify(pls);
};

require('./soundcloud')(function (sc) {
  var data, id = sc.user.id;

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
  data = localStorage[id];
  if (!data) {
    return;
  }
  data = parse(data);

  data.data.forEach(function (id) {
    manager.insert(Playlist.fromJSON(id, parse(localStorage[id])));
  });
  manager.select(data.selected);
});
