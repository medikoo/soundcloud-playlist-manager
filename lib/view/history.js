// History controllers

'use strict';

var history = require('../history')
  , undo = document.querySelector('input.undo')
  , redo = document.querySelector('input.redo');

undo.onclick = history.back.bind(history);
redo.onclick = history.forward.bind(history);

history.on('update', function (e) {
  undo.disabled = !e.current;
  redo.disabled = (e.current === e.length);
});
undo.disabled = redo.disabled = true;
