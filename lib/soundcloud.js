// SoundCloud SDK promise proxy
// Returns promise that's resolved when user have authenticated and
// we got his details

'use strict';

var isError        = Error.isError
  , toArray        = Object.toArray
  , createDeferred = require('deferred/lib/deferred')

// Get authentiation token
  , auth = localStorage._auth

// Initialize unresolved promise
  , deferred = createDeferred()

  , get, connect, getUser, connectCallback;

// Promise wrapper for SC.get
get = exports.get = function () {
  var deferred = createDeferred();
  SC.get.apply(SC, toArray(arguments).concat(function (obj, err) {
    if (err && (!isError(err))) {
      err = new Error(err.message);
    }
    deferred.resolve(err || obj);
  }));
  return deferred.promise;
};

connectCallback = SC.connectCallback;

// Promise wrapper for SC.connect
connect = function () {
  var deferred = createDeferred();

  // Override connectCallback for better error handling
  SC.connectCallback = function () {
    var hash = SC._popupWindow.location.hash;
    localStorage._auth = hash &&
      hash.match(/#access_token=([\0-%'-\uffff]+)/)[1];
    try {
      connectCallback.apply(this, arguments);
      deferred.resolve(localStorage._auth ? null :
          new Error("Could not authenticate"));
    } catch (e) {
      deferred.resolve(e);
    }
  };

  // Connect!
  SC.connect(Function.noop);

  // Return promise
  return deferred.promise;
};

// Returns user object, authenticates if needed
getUser = function (aftConnect) {
  return get('/me')(function (user) {
    exports.user = user;
  }, function () {
    // Authentication expired, connect again
    if (!aftConnect) {
      return connect()(getUser.partial(true));
    } else {
      throw new Error("Could not get User data");
    }
  });
};

// Logouts user
exports.logout = function () {
  delete localStorage._auth;
  location.reload();
};

(module.exports = deferred.promise).initialize = function () {

  // Prevent from calling initialize twice
  module.exports.initialize = Function.noop;

  // Initialize SoundCloud SDK
  SC.initialize({
    client_id: exports.key = require('../config').KEY,
    redirect_uri: location.protocol + '//' + location.host +
      '/auth-callback.html',
    access_token: auth
  });

  // We need to be authenticated and have user information
  (auth ? getUser() : connect()(getUser.partial(true)))
    .end(deferred.resolve.partial(exports), deferred.resolve);

};

if (auth) {
  // If already authorized, setup application
  module.exports.initialize();
}
