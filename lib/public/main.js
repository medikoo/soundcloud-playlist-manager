// Program initialization

'use strict';

// Implementation extensions
require('../ext');

// SoundManager2 configuration
require('../soundmanager2').end();

// SoundCloud authentication
require('../soundcloud').end(function () {
  // Authenticated

  // Setup history
  require('../history');
}, null);

// Initialize view
require('../view');
