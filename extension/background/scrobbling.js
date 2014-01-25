var apiURL = 'http://ws.audioscrobbler.com/2.0/?',
	apiKey = '74639aa1297c3397d80d934196f1e542',
	apiSecret = '672707041194c804c5973e54fb4ee520';

function _apiSign(params) {
	var keys = Object.keys(params),
		result = '';

	// alphabetical sort
	keys.sort();
	keys.forEach(function (key) {
		if (key == 'format' || key == 'callback')
			return;

		result += key + params[key];
	});

	return MD5(result + apiSecret);
}

function _queryString(params) {
	var parts = [];

	for (var x in params) {
		parts.push(x + '=' + encodeURIComponent(params[x]));
	}

	return parts.join('&');
}

var _authInterval;

function _authorize(callback) {
	clearInterval(_authInterval);

	var xhr = new XMLHttpRequest();

	xhr.open('GET', apiURL + 'method=auth.getToken&api_key=' + apiKey + '&format=json');
	xhr.setRequestHeader('Content-Type', 'application/json');

	xhr.onload = function () {
		var json = JSON.parse(xhr.responseText);

		if (json.error) {
			localStorage.removeItem('token');
		} else {
			localStorage.setItem('token', json.token);

			var win = window.open('https://www.last.fm/api/auth/?api_key=' + apiKey + '&token=' + json.token, 'lastfm_popup', 'width=1024,height=475');

			if (callback) {
				win.onunload = function () {
					console.log('uload');
				}

				console.log(win.closed);
				_authInterval = setInterval(function () {
					console.log(win.closed);
					if (win.closed) {
						callback(null, json.token);
					}
				}, 100);
			}
		}
	};

	xhr.send();
}

function _sessionID(callback) {
	if (!localStorage.token) {
		// do nothing
		callback(true);
		return;
	}

	if (localStorage.sessionID) {
		// already got session key
		callback(null, localStorage.sessionID);
		return;
	}

	var params = {
			method: 'auth.getsession',
			api_key: apiKey,
			token: localStorage.token,
			format: 'json'
		},
		url = apiURL + _queryString(params) + '&api_sig=' + _apiSign(params);

	var xhr = new XMLHttpRequest();

	xhr.open('GET', url);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onload = function () {
		var json = JSON.parse(xhr.responseText);

		if (json.error) {
			localStorage.removeItem('sessionID');
			_authorize();
		} else {
			localStorage.sessionID = json.session.key;
			callback(null, localStorage.sessionID);
		}
	};

	xhr.send();
}

function _userProfile(callback) {
	// if there's no token
	// there's no user
	if (!localStorage.token) {
		callback(null);
		return;
	}

	_sessionID(function (error, sessionID) {
		if (error) {
			callback(null);
			return;
		}

		var params = {
				method: 'user.getInfo',
				api_key: apiKey,
				sk: sessionID,
				format: 'json'
			},
			api_sig = _apiSign(params),
			url = apiURL + _queryString(params) + '&api_sig=' + api_sig;

		var xhr = new XMLHttpRequest();

		xhr.open('GET', url);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function () {
			var json = JSON.parse(xhr.responseText);

			callback(json.user);
		};

		xhr.send();
	});
}

function _nowPlaying(track) {
	if (!settings.last_fm_now_playing) {
		return;
	}

	_sessionID(function (error, sessionID) {
		if (error) {
			return;
		}

		var params = {
			method: 'track.updateNowPlaying',
			track: track.title,
			artist: track.artist,
			album: track.album,
			duration: Math.ceil(track.duration / 1000),
			api_key: apiKey,
			sk: sessionID
		};

		var api_sig = _apiSign(params),
			url = apiURL + _queryString(params) + '&api_sig=' + api_sig;

		var xhr = new XMLHttpRequest();

		xhr.open('POST', url);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			var responseXML = xhr.responseXML,
				status = responseXML.querySelector('lfm').getAttribute('status');

			if (status === 'ok') {
				// now playing was set
			} else {
				notify('Last.fm error', 'Unable to set now playing track. See http://status.last.fm');
			}
		};

		xhr.send(params);
	});
}

function _scrobble(track, timestamp) {
	if (!settings.last_fm) {
		return;
	}

	_sessionID(function (error, sessionID) {
		if (error) {
			return;
		}

		var params = {
			method: 'track.scrobble',
			timestamp: Math.floor(timestamp / 1000),
			track: track.title,
			artist: track.artist,
			album: track.album,
			api_key: apiKey,
			sk: sessionID
		};

		var api_sig = _apiSign(params),
			url = apiURL + _queryString(params) + '&api_sig=' + api_sig;

		var xhr = new XMLHttpRequest();

		xhr.open('POST', url);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			if (xhr.status == 200) {
				var responseXML = xhr.responseXML,
					status = responseXML.querySelector('lfm').getAttribute('status');

				if (status === 'ok') {
					// ok

					if (settings.last_fm_notify) {
						notify('Chime', 'Track was scrobbled to last.fm!', track.cover);
					}
				} else {
					// error scrobbling
				}
			} else {
				notify('Last.fm error', 'Unable to scrobble track. See http://status.last.fm');
			}
		};

		xhr.send(params);
	});
}

function scrobblingHandler(command, callback) {
	switch (command.type) {
		case 'playing':
			_nowPlaying(command.track);
			break;
		case 'scrobble':
			_scrobble(command.track, command.timestamp);
			break;
		case 'profile':
			_userProfile(callback);
			break;
		case 'authorize':
			_authorize(callback);
			break;
	}
}
