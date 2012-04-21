// Promise of soundManager2

'use strict';

var deferred = require('deferred')();

soundManager.onready(function () {
  deferred.resolve(soundManager);
});

module.exports = deferred.promise;
