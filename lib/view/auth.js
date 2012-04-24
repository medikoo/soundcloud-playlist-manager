// General view configuration

'use strict';

var sc      = require('../soundcloud')
  , notice  = document.querySelector('section.notice')
  , noAuth  = document.querySelector('section.no-auth');

noAuth.querySelector('a').onclick = function () {
  noAuth.style.display = 'none';
  notice.style.display = '';
  sc.initialize();
};

sc.end(function (sc) {
  // We're authenticated
  noAuth.style.display = 'none';
  notice.style.display = 'none';
  document.body.classList.add('auth');

  // Show username
  document.querySelector('b.user-name')
    .appendChild(document.createTextNode(sc.user.username));

  // Setup logout link
  document.querySelector('a.logout').onclick = sc.logout;

}, function (err) {
  // Authentication failed, display apropriate message
  var p, a;
  console.error(err.stack);
  p = notice.querySelector('p');
  p.innerHTML = '';
  p.appendChild(document.createTextNode("To be able to use this application, "
    + "you need to log-in with SoundCloud account. "));
  a = p.appendChild(document.createElement("a"));
  a.onclick = location.reload.bind(location);
  a.appendChild(document.createTextNode("Please try again."));
});
