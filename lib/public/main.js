// Program initialization

'use strict';

// Implementation extensions
require('../ext');

// SoundManager2 configuration
require('../soundmanager2').end();

// Initialize authentication controllers
require('../view/auth');

// Configure services for authenticated user
require('../soundcloud').end(function () {
  // Authenticated

  // Manager
  require('../playlist-manager');

  // LocalStorage
  require('../local-storage');

  // History
  require('../history');

}, null);
