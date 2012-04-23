// Complimentary EcmaScript extensions

'use strict';

var o;

o = Function;
o.isFunction = require('es5-ext/lib/Function/is-function');
o.memoize    = require('es5-ext/lib/Function/memoize');
o.pluck      = require('es5-ext/lib/Function/pluck');

o = Function.prototype;
o.partial = require('es5-ext/lib/Function/prototype/partial');

o = Number;
o.isNumber = require('es5-ext/lib/Number/is-number');

o = Object;
Object.forEach = require('es5-ext/lib/Object/for-each');
Object.merge   = require('es5-ext/lib/Object/merge');
Object.toArray = require('es5-ext/lib/Object/to-array');

o = String.prototype;
o.startsWith = require('es5-ext/lib/String/prototype/starts-with');
