// Complimentary EcmaScript extensions

'use strict';

var o;

o = Function.prototype;
o.partial = require('es5-ext/lib/Function/prototype/partial');

o = Object;
Object.merge   = require('es5-ext/lib/Object/merge');
Object.toArray = require('es5-ext/lib/Object/to-array');
