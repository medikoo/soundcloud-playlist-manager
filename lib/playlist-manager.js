// Instance of Playlist Manager

'use strict';

module.exports = new (require('./model/playlist-manager'))();

// Setup controllers
require('./view/playlist-manager');
