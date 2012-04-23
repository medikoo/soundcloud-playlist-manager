'use strict';

var k = require('es5-ext/lib/Function/k');

module.exports = function (t, a) {
  var history = new t(), x, y, z, data = [], invoked;

  history.add(function () {
    data.push('1U');
  }, function () {
    data.push('1R');
  });

  history.add(function () {
    data.push('2U');
  }, function () {
    data.push('2R');
  });

  history.once('update', function (e) {
    invoked = true;
    a.deep(e, { length: 3, current: 3 }, "Emit: add: event");
  });
  history.add(function () {
    data.push('3U');
  }, function () {
    data.push('3R');
  });
  a(invoked, true, "Emit: add");

  history.back();
  invoked = false;
  history.once('update', function (e) {
    invoked = true;
    a.deep(e, { length: 3, current: 1 }, "Emit: back: event");
  });
  history.back();
  a(invoked, true, "Emit: back");
  history.back();
  history.back();

  history.forward();
  history.forward();
  invoked = false;
  history.once('update', function (e) {
    invoked = true;
    a.deep(e, { length: 3, current: 3 }, "Emit: forward: event");
  });
  history.forward();
  a(invoked, true, "Emit: forward");
  history.forward();

  history.back();
  history.back();

  history.add(function () {
    data.push('4U');
  }, function () {
    data.push('4R');
  });

  history.forward();

  history.back();
  history.back();

  history.forward();
  history.forward();
  history.forward();

  a.deep(data,
    ['3U', '2U', '1U', '1R', '2R', '3R', '3U', '2U', '4U', '1U', '1R', '4R']);
};
