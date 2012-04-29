// Promise of soundManager2

'use strict';

soundManager.url = 'soundmanager2/swf/';
soundManager.flashVersion = 9;
soundManager.useFlashBlock = false;
soundManager.useHighPerformance = true;
soundManager.wmode = 'transparent';
soundManager.useFastPolling = true;

var deferred = require('deferred')()
  , Track    = require('./model/track')

  , getSound, paused;

getSound = Function.memoize(function (track) {
  return soundManager.createSound({
    id: 'track_' + track._id,
    url: (track.url)
  });
});

soundManager.onready(function () {
  deferred.resolve(soundManager);

  Track.on('play', function (e) {
    if (paused) {
      if (e.target !== paused) {
        soundManager.stopAll();
      } else {
        getSound(e.target).resume();
        return;
      }
    }
    getSound(e.target).play();
  });

  Track.on('stop', function (e) {
    paused = e.target;
    soundManager.pauseAll();
  });
});

module.exports = deferred.promise;
