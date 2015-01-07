define(['lastfm-core', 'settings'], function (core, settings) {
	function nowPlaying(track) {
		return core.session().then(function (sessionID) {
			return new Promise(function (fullfil, reject) {
				var params = {
						method: 'track.updateNowPlaying',
						track: track.title,
						artist: track.artist,
						album: track.album,
						duration: Math.ceil(track.duration / 1000),
						api_key: settings.get('scrobbling_api_key'),
						sk: sessionID,
						format: 'json'
					},
					api_sig = core.sign(params),
					url = settings.get('scrobbling_api_url'),
					xhr = new XMLHttpRequest();

				xhr.open('POST', url);
				xhr.timeout = 10000;
				xhr.onerror = xhr.ontimeout = function () {
					reject('timeout');
				};
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhr.onload = function () {
					fullfil();
				};

				xhr.send(queryString(params) + '&api_sig=' + api_sig);
			});
		});
	}

	function scrobble(timestamp, track) {
		return core.session().then(function (sessionID) {
			return new Promise(function (fullfil, reject) {
				var params = {
						method: 'track.scrobble',
						timestamp: Math.floor(timestamp / 1000),
						track: track.title,
						artist: track.artist,
						album: track.album,
						api_key: settings.get('scrobbling_api_key'),
						sk: sessionID,
						format: 'json'
					},
					api_sig = core.sign(params),
					url = settings.get('scrobbling_api_url'),
					xhr = new XMLHttpRequest();

				xhr.open('POST', url);
				xhr.timeout = 10000;
				xhr.onerror = xhr.ontimeout = function () {
					reject('timeout');
				};
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhr.onload = function () {
					fullfil();
				};

				xhr.send(queryString(params) + '&api_sig=' + api_sig);
			});
		});
	}

	function getProfile() {
		return core.session().then(function (sessionID) {
			return new Promise(function (fullfil, reject) {
				var params = {
						method: 'user.getInfo',
						api_key: settings.get('scrobbling_api_key'),
						sk: sessionID,
						format: 'json'
					},
					api_sig = core.sign(params),
					url = settings.get('scrobbling_api_url') + queryString(params) + '&api_sig=' + api_sig;

				var xhr = new XMLHttpRequest();

				xhr.open('GET', url);
				xhr.timeout = 10000;
				xhr.onerror = xhr.ontimeout = function () {
					reject('timeout');
				};
				xhr.onload = function () {
					var json = JSON.parse(xhr.responseText),
						user = json.user;

					if (user) {
						fullfil(user);
					} else {
						reject(json.error);
					}
				};

				xhr.send();
			});
		});
	}
	
	return {
		core: core,
		nowPlaying: nowPlaying,
		scrobble: scrobble,
		getProfile: getProfile
	};
});