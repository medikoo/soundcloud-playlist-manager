// Function.prototype.bind for imperfect

'use strict';

var slice  = Array.prototype.slice

  , cache, getBody, body;

if (!Function.prototype.bind) {
  cache = [];

  body = function (target, that, args, slice, bound) {
    if (this instanceof bound) {
      var F = function () {}, self, result;
      F.prototype = target.prototype;
      self = new F();
      result = target.apply(self, args.concat(slice.call(arguments)));
      if (result && (typeof result === 'object')) {
        return result;
      }
      return self;
    } else {
      return target.apply(that, args.concat(slice.call(arguments)));
    }
  }.toString();

  getBody = (function (genArgs, body) {
    return function (length) {
      return cache[length] || (cache[length] = new Function('target', 'that',
        'args', 'slice', 'return function bound (' + genArgs(length) + ') {' +
        body + '};'));
    };
  }(function (length) {
    var args = [];
    while (length--) {
      args.push('a' + length.toString(32));
    }
    return args.join(', ');
  }, body.slice(body.indexOf('{') + 1, -1)));

  Function.prototype.bind = function bind(that) {
    if (typeof this !== "function") {
      return new TypeError();
    }
    return getBody(this.length)(this, that, slice.call(arguments, 1), slice);
  };
}
