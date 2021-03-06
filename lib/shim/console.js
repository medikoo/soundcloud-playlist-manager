// Make sure that console calls won't break application

'use strict';

if (!('console' in window)) {
  window.console = {};
}
['log', 'debug', 'warn', 'error'].forEach(function (name) {
  if (!console[name]) {
    console[name] = this;
  }
}, function () {});
