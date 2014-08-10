define(['md5', 'settings'], function (md5, settings) {
	function sign(params) {
		var keys = Object.keys(params),
			result = '';

		// alphabetical sort
		keys.sort();
		keys.forEach(function (key) {
			if (key == 'format' || key == 'callback')
				return;

			result += key + params[key];
		});

		return md5(result + settings.get('scrobbling_api_secret'));
	}

	function authorize(callback) {
		clearInterval(authorize.interval);

		var params = {
				method: 'auth.getToken',
				api_key: settings.get('scrobbling_api_key'),
				format: 'json'
			},
			url = settings.get('scrobbling_api_url') + queryString(params),
			xhr = new XMLHttpRequest();

		xhr.open('GET', url);
		xhr.onload = function () {
			var json = JSON.parse(xhr.responseText);

			if (!json.error) {
				var win = window.open('https://www.last.fm/api/auth/?api_key=' +
						settings.get('scrobbling_api_key') + '&token=' + json.token,
					'lastfm_popup',
					'width=1024,height=475');

				if (callback) {
					authorize.interval = setInterval(function () {
						if (win.closed) {
							clearInterval(authorize.interval);
							settings.set('scrobbling_token', json.token);
							callback(null, json.token);
						}
					}, 100);
				}
			}
		};

		xhr.send();
	}

	function session(callback) {
		var sessionID = settings.get('scrobbling_sessionID'),
			token = settings.get('scrobbling_token');

		if (!token) {
			// do nothing
			callback(true);
			return;
		}

		if (sessionID) {
			// already got session key
			callback(null, sessionID);
			return;
		}

		var params = {
				method: 'auth.getsession',
				api_key: settings.get('scrobbling_api_key'),
				token: token,
				format: 'json'
			},
			url = settings.get('scrobbling_api_url') + queryString(params) + '&api_sig=' + sign(params),
			xhr = new XMLHttpRequest();

		xhr.open('GET', url);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function () {
			var json = JSON.parse(xhr.responseText);

			if (json.error) {
				callback(json.error);
			} else {
				sessionID = json.session.key;
				settings.set('scrobbling_sessionID', sessionID);

				callback(null, sessionID);
			}
		};

		xhr.send();
	}

	function nowPlaying(track, callback) {
		session(function (error, sessionID) {
			if (error) {
				callback(error);
				return;
			}

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
				api_sig = sign(params),
				url = settings.get('scrobbling_api_url'),
				xhr = new XMLHttpRequest();

			xhr.open('POST', url);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.onload = function () {
				callback();
			};

			xhr.send(queryString(params) + '&api_sig=' + api_sig);
		});
	}

	function scrobble(timestamp, track, callback) {
		session(function (error, sessionID) {
			if (error) {
				callback(error);
				return;
			}

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
				api_sig = sign(params),
				url = settings.get('scrobbling_api_url'),
				xhr = new XMLHttpRequest();

			xhr.open('POST', url);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.onload = function () {
				callback();
			};

			xhr.send(queryString(params) + '&api_sig=' + api_sig);
		});
	}

	return {
		session: session,
		authorize: authorize,
		sign: sign,
		nowPlaying: nowPlaying,
		scrobble: scrobble
	};
});


