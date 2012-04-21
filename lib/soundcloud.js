// SoundCloud SDK promises proxy
// Returns promise that's resolved when user have authenticated
// and we got his details

'use strict';

var toArray        = Object.toArray
  , createDeferred = require('deferred/lib/deferred')

  , auth = localStorage._auth, deferred = createDeferred()
  , get, connect, getUser;

// Promise wrapper for SC.get
get = function () {
  var deferred = createDeferred();
  SC.get.apply(SC, toArray(arguments).concat(function (obj, err) {
    deferred.resolve(err || obj);
  }));
  return deferred.promise;
};

// Promise wrapper for SC.connect
connect = function () {
  var deferred = createDeferred();
  SC.connect(function () {
    deferred.resolve();
  });
  return deferred.promise;
};

// Returns user object, authenticates if needed
getUser = function () {
  return get('/me')(function (user) {
    exports.user = user;
  }, function () {
    // Authentication expired, connect again
    return connect()(getUser);
  });
};

// Initialize SoundCloud SDK
SC.initialize({
  client_id: require('../config').KEY,
  redirect_uri: location.protocol + '//' + location.host +
    '/auth-callback.html',
  access_token: auth
});

// Logouts user
exports.logout = function () {
  delete localStorage._auth;
  location.reload();
};

// We need to be authenticated and have user information
(auth ? getUser() : connect()(getUser))(deferred.resolve.partial(exports));

module.exports = deferred.promise;
