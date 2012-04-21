// Promise of soundManager2

'use strict';

var deferred = require('deferred')();

soundManager.url = 'soundmanager2/swf/';
soundManager.flashVersion = 9;
soundManager.useFlashBlock = false;
soundManager.useHighPerformance = true;
soundManager.wmode = 'transparent';
soundManager.useFastPolling = true;

soundManager.onready(function () {
  deferred.resolve(soundManager);
});

module.exports = deferred.promise;
