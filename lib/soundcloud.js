// SoundCloud SDK promises proxy
// Returns promise that's resolved when user have authenticated
// and we got his details

'use strict';

var toArray        = Object.toArray
  , createDeferred = require('deferred/lib/deferred')

  , auth = localStorage._auth, deferred = createDeferred()
  , get, connect, getUser;

get = function () {
  var deferred = createDeferred();
  SC.get.apply(SC, toArray(arguments).concat(function (obj, err) {
    deferred.resolve(err || obj);
  }));
  return deferred.promise;
};

connect = function () {
  var deferred = createDeferred();
  SC.connect(function () {
    deferred.resolve();
  });
  return deferred.promise;
};

getUser = function () {
  return get('/me')(function (user) {
    exports.user = user;
  }, function () {
    // Authentication expired, connect again
    return connect()(getUser);
  });
};

SC.initialize({
  client_id: require('../config').KEY,
  redirect_uri: location.protocol + '//' + location.host +
    '/auth-callback.html',
  access_token: auth
});

// We need to be authenticated and have user information
(auth ? getUser() : connect()(getUser))(deferred.resolve.partial(exports));

module.exports = deferred.promise;
