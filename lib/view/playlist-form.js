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
  if (!form.title.value.trim()) {
    alert("Title can't be empty");
    return;
  }
  if (current) {
    current.title.update(form.title.value.trim());
    current.description.update(form.description.value.trim());
  } else {
    manager.insert(new Playlist(form.title.value.trim(),
      form.description.value.trim()));
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