'use strict';

try {
  global.document = new (require('jsdom/lib/jsdom/level3/core')
    .dom.level3.core.Document)();
} catch (e) {
  throw new Error('`jsdom` package needs to be installed, to run tests');
}

var resolve = require('path').resolve
  , suite   = require('tad/lib/suite');

require('../lib/ext');

suite([resolve(__dirname, '../lib/model')])(function (suite) {
  var c = suite.console;
  process.on('exit', function () {
    process.exit(c.errored ? 2 : (c.failed ? 1 : 0));
  });
});
