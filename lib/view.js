// General view configuration

'use strict';

var forEach = Array.prototype.forEach
  , notice  = document.querySelector('section.notice');

require('./soundcloud').end(function (sc) {
  // We're authenticated
  notice.style.display = 'none';
  document.body.classList.add('auth');

  // Show username
  document.querySelector('b.user-name')
    .appendChild(document.createTextNode(sc.user.username));

  // Setup logout link
  document.querySelector('a.logout').onclick = sc.logout;

}, function (err) {
  // Authentication failed, display propriate message
  var p, a;
  console.error(err.stack);
  p = notice.querySelector('p');
  p.innerHTML = '';
  p.appendChild(document.createTextNode("To be able to use this application, "
    + "you need to log-in with SoundCloud account. "));
  a = p.appendChild(document.createElement("a"));
  a.classList.add('dynamic');
  a.onclick = location.reload.bind(location);
  a.appendChild(document.createTextNode("Please try again."));
});
