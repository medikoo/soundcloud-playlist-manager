// Add/Edit playlist form

'use strict';

var Playlist  = require('../model/playlist')
  , manager   = require('../playlist-manager')
  , container = document.querySelector('section.playlist-form')
  , form      = container.querySelector('form')
  , heading   = container.querySelector('h3').firstChild

  , current;

form.onsubmit = function (e) {
  e.preventDefault();
  if (!form.title.value) {
    alert("Playlist needs a title");
    return;
  }
  if (current) {
    current.title.update(form.title.value);
    current.description.update(form.description.value);
  } else {
    manager.insert(new Playlist(form.title.value, form.description.value));
  }
  container.style.display = 'none';
};

module.exports = function (pls) {
  current = pls;
  heading.data = pls ? 'Edit: ' + pls : 'Add New Playlist';
  form.title.value = pls ? pls.title : '';
  form.description.value = pls ? pls.description : '';
  container.style.display = 'block';
};
