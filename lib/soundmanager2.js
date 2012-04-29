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

  , getSound, onfinish, playing = {};

onfinish = function () {
  playing.target._onfinish(playing.playlist);
};

getSound = Function.memoize(function (track) {
  return soundManager.createSound({
    id: 'track_' + track._id,
    url: (track.url),
    onfinish: onfinish
  });
});

soundManager.onready(function () {
  deferred.resolve(soundManager);

  Track.on('play', function (e) {
    getSound(e.target).play();
    playing = e;
  });

  Track.on('stop', function (e) {
    soundManager.stopAll();
  });
});

module.exports = deferred.promise;
