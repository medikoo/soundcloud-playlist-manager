// Complimentary EcmaScript extensions

'use strict';

var o;

o = Array;
if (!o.from) {
	Object.defineProperty(o, 'from', {
		value: require('es5-ext/lib/Array/from'),
		configurable: true, writable: true });
}

o = Error;
o.isError    = require('es5-ext/lib/Error/is-error');

o = Function;
o.isFunction = require('es5-ext/lib/Function/is-function');
o.noop       = require('es5-ext/lib/Function/noop');
o.pluck      = require('es5-ext/lib/Function/pluck');

o = Function.prototype;
o.memoize = require('es5-ext/lib/Function/prototype/memoize');
o.partial = require('es5-ext/lib/Function/prototype/partial');

o = Number;
o.isNumber = require('es5-ext/lib/Number/is-number');
o.toUint   = require('es5-ext/lib/Number/to-uint');

o = Object;
Object.copy    = require('es5-ext/lib/Object/copy');
Object.forEach = require('es5-ext/lib/Object/for-each');
Object.extend  = require('es5-ext/lib/Object/extend');

o = String;
o.isString = require('es5-ext/lib/String/is-string');

o = String.prototype;
o.startsWith = require('es5-ext/lib/String/prototype/starts-with');
