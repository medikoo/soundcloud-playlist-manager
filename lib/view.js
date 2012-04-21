// General view configuration

'use strict';

var forEach = Array.prototype.forEach;

require('./soundcloud')(function (sc) {
  // We're authenticated
  document.body.classList.add('auth');

  // Show username
  document.querySelector('b.user-name')
    .appendChild(document.createTextNode(sc.user.username));

  // Setup logout link
  document.querySelector('a.logout').onclick = sc.logout;
});
