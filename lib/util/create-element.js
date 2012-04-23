// DOM util. Convient way to create elements

'use strict';

var slice      = Array.prototype.slice
  , isFunction = Function.isFunction
  , forEach    = Object.forEach
  , isString   = String.isString

  , isNode;

// Whether object is DOM node
isNode  = function (x) {
  return (x && (typeof x.nodeType === "number") &&
    (typeof x.nodeName === "string")) || false;
};

module.exports = function (name, attributes) {
  var children, el;
  el = document.createElement(name);
  if (!attributes) {
    return el;
  }
  if (isNode(attributes)) {
    children = slice.call(arguments, 1);
  } else {
    forEach(attributes, function (value, name) {
      if (name.startsWith('on') && isFunction(value)) {
        el[name] = value;
      } else {
        el.setAttribute(name, value);
      }
    });
    children = slice.call(arguments, 2);
  }
  children.forEach(function (child) {
    el.appendChild(isString(child) ? document.createTextNode(child) : child);
  });
  return el;
};
