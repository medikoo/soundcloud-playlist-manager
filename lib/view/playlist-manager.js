// View configuration for Playlist Manager

'use strict';

var manager    = require('../playlist-manager')
  , form       = require('./playlist-form')
  , managerDom = document.querySelector('section.playlist-manager')
  , list       = managerDom.querySelector('ul')

  , plsToDOM;

// Setup "Add Playlist" button
managerDom.querySelector('input.add-playlist').onclick = form.partial(null);

// Setup "Playlist list"
// Memoize each playlist list item (create once, reuse)
plsToDOM = Function.memoize(function (pls) {
  var li, a;
  li = document.createElement('li');
  a = li.appendChild(document.createElement('a'));
  a.appendChild(pls.toDOM());
  return li;
});

// Redraw playlist on each manager update
manager.on('update', function () {
  var length = list.childNodes.length;
  manager.map(plsToDOM).forEach(list.appendChild, list);
  while (manager.length < list.length) {
    list.removeChild(list.lastChild);
  }
});
