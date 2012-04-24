// Controller for common interfaces

'use strict';

var forEach = Array.prototype.forEach;

// Setup close window actions for overlays
forEach.call(document.querySelectorAll('.overlay p.close a'), function (a) {
  var overlay = a.parentNode;
  while (overlay && !overlay.classList.contains('overlay')) {
    overlay = overlay.parentNode;
  }
  if (overlay) {
    a.onclick = function () {
      overlay.style.display = 'none';
    };
  }
});
