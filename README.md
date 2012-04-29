# Playlist Manager for SoundCloud

Prototype of playlist manager for tracks available at SoundCloud.

Can be seen live at http://soundcloud-playlist-manager.medyk.org/

It's client-side only application, playlists information are saved to
localStorage, so playlists saved in one browser won't be seen in other.

## Installation
To install this application on your own, apart of downloading this source
code two steps needs to be done:

* Register new SoundCloud application at http://soundcloud.com/you/apps/. and set _Redirect URI_ to _http://<location-where-its-hosted>/auth-callback.html_. Afterwards create _config.js_ file in main folder with this content:

```javascript
exports.KEY = 'YOUR APPLICATION CLIENT ID';
````

Be sure fill _Client ID_ of your application.

* Make sure you have [Node.js](http://nodejs.org/) installed and run `npm run-script setup` in application folder
