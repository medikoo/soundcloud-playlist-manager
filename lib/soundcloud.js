// SoundCloud SDK promises proxy
// Returns promise that's resolved when user have authenticated
// and we got his details

'use strict';

var toArray        = Object.toArray
  , createDeferred = require('deferred/lib/deferred')

  , auth = localStorage._auth, deferred = createDeferred()
  , get, connect, getUser, connectCallback;

// Promise wrapper for SC.get
get = function () {
  var deferred = createDeferred();
  SC.get.apply(SC, toArray(arguments).concat(function (obj, err) {
    deferred.resolve(err || obj);
  }));
  return deferred.promise;
};

connectCallback = SC.connectCallback;

// Promise wrapper for SC.connect
connect = function () {
  var deferred = createDeferred();
  SC.connectCallback = function () {
    var hash = SC._popupWindow.location.hash;
    localStorage._auth = hash &&
      hash.match(/#access_token=([\0-%'-\uffff]+)/)[1];
    try {
      return connectCallback.apply(this, arguments);
    } catch (e) {
      deferred.resolve(e);
    }
  };
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
(auth ? getUser() : connect()(getUser))
  .end(deferred.resolve.partial(exports), deferred.resolve);

module.exports = deferred.promise;
