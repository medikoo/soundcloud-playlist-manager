// Program initialization

'use strict';

// Shim missing API's and methods
require('../shim/console');
require('../shim/class-list');
require('../shim/bind');

// Low-level EcmaScript extensions
require('../ext');

// SoundManager2 configuration
require('../soundmanager2').end();

// Initialize authentication controllers
require('../view/auth');

// Configure services for authenticated user
require('../soundcloud').end(function () {

  // Manager
  require('../playlist-manager');

  // LocalStorage
  require('../local-storage');

  // History
  require('../history');

}, null);
