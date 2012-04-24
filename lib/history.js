'use strict';

var manager = require('./playlist-manager')

  , listener;

exports = module.exports = new (require('./model/history'))();

listener = function (e) {
  if (e.history) {
    exports.add(e.history());
  }
};

// Listen for changes (add/remove track) on each playlist
manager.forEach(function (pl) {
  pl.on('update', listener);
});

// Listen for changes (add/remove playlist) on manager
manager.on('update', function (e) {
  listener(e);
  if (e.action === 'insert') {
    // New playlist
    e.target.on('update', listener);
  } else if (e.action === 'remove') {
    // Deleted playlist
    e.target.off('update', listener);
  }
});

// Setup controllers
require('./view/history');
