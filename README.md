# Playlist Manager for SoundCloud

Prototype of playlist manager for tracks available at [SoundCloud](http://soundcloud.com).

Can be seen live at http://soundcloud-playlist-manager.medyk.org/

It's client-side only application, playlists information are saved in
localStorage, so playlists saved in one browser won't be seen in other.

## Installation
To install this application on your own, apart of downloading this source
code two steps needs to be done:

* Register new SoundCloud application at http://soundcloud.com/you/apps/ set _Redirect URI_ to _http://\<location-where-youre-going-to-host-it\>/auth-callback.html_ and create _config.js_ file in main folder with following content

```javascript
exports.KEY = '...' // Fill with your application Client ID;
````

* Make sure you have [Node.js](http://nodejs.org/) installed and run `npm install` and `npm run-script setup` in application folder
