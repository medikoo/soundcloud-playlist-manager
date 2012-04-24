// Program initialization

'use strict';

// Implementation extensions
require('../ext');

// SoundManager2 configuration
require('../soundmanager2').end();

// Initialize authentication controllers
require('../view');

// Configure services for authenticated user
require('../soundcloud').end(function () {
  // Authenticated

  // History
  require('../history');
}, null);
