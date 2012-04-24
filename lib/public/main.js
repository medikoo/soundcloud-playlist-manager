// Program initialization

'use strict';

// Implementation extensions
require('../ext');

// SoundManager2 configuration
require('../soundmanager2').end();

// Initialize common controllers
require('../view/common');

// Initialize authentication controllers
require('../view/auth');

// Configure services for authenticated user
require('../soundcloud').end(function () {
  // Authenticated

  // Manager
  require('../playlist-manager');

  // History
  require('../history');
}, null);
