'use strict';

module.exports = function (t, a) {
  var x, y, z, invoked, invoked2, invoked3, invoked4;

  x = new t('x', 'X title', 'X user', 'http://player.org/x/');
  y = t.fromJSON('y',
    { title: 'Y title', user: 'Y user', url: 'http://player.org/y/' });

  a(x.title, 'X title', "Title");
  a(x.user, 'X user', "User");
  a(x.url, 'http://player.org/x/', "Url");

  invoked = false;
  t.once('play', function (e) {
    invoked = true;
    a(e.target, x, "Play: event: target");
  });
  invoked2 = false;
  x.once('play', function (e) {
    invoked2 = true;
  });
  x.play();
  a(invoked, true, "Play: event");
  a(invoked2, true, "Play: track event");
  a(x.playing, true, "Playing status");

  invoked = false;
  invoked2 = false;
  invoked3 = false;
  invoked4 = false;
  t.once('stop', function (e) {
    invoked = true;
    a(e.target, x, "Stop: event: target");
    a.deep([invoked3, invoked4], [false, false], "Stop: event: before play");
  });
  x.once('stop', function (e) {
    invoked2 = true;
    a.deep([invoked3, invoked4], [false, false],
      "Stop: track event: before play");
  });
  t.once('play', function (e) {
    invoked3 = true;
  });
  y.once('play', function (e) {
    invoked4 = true;
  });
  y.play();
  a(invoked, true, "Stop: event");
  a(invoked2, true, "Stop: track event");
  a(invoked3, true, "Play: event: #2");
  a(invoked4, true, "Play: track event: #2");
  a(x.playing, false, "Stopped status");
  a(y.playing, true, "Playing status #2");

  a(new t('x', 'asdf', 'fefe', 'sdfds'), x,
    "Return already craeted track for same id");

  a(t.get(x._id), x, "get");

  a.deep(y.toJSON(), { title: y.title, user: y.user, url: y.url }, "toJSON");
};
