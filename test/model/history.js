'use strict';

var k = require('es5-ext/lib/Function/k');

module.exports = function (t, a) {
  var history = new t(), x, y, z, invoked = [];

  history.add(function () {
    invoked.push('1U');
  }, function () {
    invoked.push('1R');
  });

  history.add(function () {
    invoked.push('2U');
  }, function () {
    invoked.push('2R');
  });

  history.add(function () {
    invoked.push('3U');
  }, function () {
    invoked.push('3R');
  });

  history.back();
  history.back();
  history.back();
  history.back();

  history.forward();
  history.forward();
  history.forward();
  history.forward();

  history.back();
  history.back();

  history.add(function () {
    invoked.push('4U');
  }, function () {
    invoked.push('4R');
  });

  history.forward();

  history.back();
  history.back();

  history.forward();
  history.forward();
  history.forward();

  a.deep(invoked,
    ['3U', '2U', '1U', '1R', '2R', '3R', '3U', '2U', '4U', '1U', '1R', '4R']);
};
