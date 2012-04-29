// Complimentary EcmaScript extensions

'use strict';

var o;

o = Error;
o.isError    = require('es5-ext/lib/Error/is-error');

o = Function;
o.isFunction = require('es5-ext/lib/Function/is-function');
o.memoize    = require('es5-ext/lib/Function/memoize');
o.noop       = require('es5-ext/lib/Function/noop');
o.pluck      = require('es5-ext/lib/Function/pluck');

o = Function.prototype;
o.partial = require('es5-ext/lib/Function/prototype/partial');

o = Number;
o.isNumber   = require('es5-ext/lib/Number/is-number');
o.toUinteger = require('es5-ext/lib/Number/to-uinteger');

o = Object;
Object.copy    = require('es5-ext/lib/Object/copy');
Object.forEach = require('es5-ext/lib/Object/for-each');
Object.merge   = require('es5-ext/lib/Object/merge');
Object.toArray = require('es5-ext/lib/Object/to-array');

o = String;
o.isString = require('es5-ext/lib/String/is-string');

o = String.prototype;
o.startsWith = require('es5-ext/lib/String/prototype/starts-with');
