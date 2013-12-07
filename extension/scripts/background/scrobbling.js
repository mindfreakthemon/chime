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

function _authorize() {
	var xhr = new XMLHttpRequest();

	xhr.open('GET', apiURL + 'method=auth.getToken&api_key=' + apiKey);
	xhr.setRequestHeader('Content-Type', 'application/xml');

	xhr.onload = function () {
		var responseXML = xhr.responseXML,
			status = responseXML.querySelector('lfm').getAttribute('status');

		if (status === 'ok') {
			localStorage.token = responseXML.querySelector('token').firstChild.nodeValue;

			window.open('https://www.last.fm/api/auth/?api_key=' + apiKey + '&token=' + localStorage.token);
		} else {
			localStorage.token = '';
		}
	};

	xhr.send();
}

function _sessionID(callback) {
	if (!localStorage.token) {
		_authorize();
		return;
	}

	if (localStorage.sessionID) {
		callback(null, localStorage.sessionID);
		return;
	}

	var params = {
			method: 'auth.getsession',
			api_key: apiKey,
			token: localStorage.token
		},
		url = apiURL + _queryString(params) + '&api_sig=' + _apiSign(params);

	var xhr = new XMLHttpRequest();

	xhr.open('GET', url);
	xhr.setRequestHeader('Content-Type', 'application/xml');
	xhr.onload = function () {
		var responseXML = xhr.responseXML,
			status = responseXML.querySelector('lfm').getAttribute('status');

		if (status === 'ok') {
			localStorage.sessionID = responseXML.querySelector('key').firstChild.nodeValue;

			callback(null, localStorage.sessionID);
		} else {
			localStorage.sessionID = '';

			_authorize();
		}
	};

	xhr.send();
}

function _nowPlaying(track) {
	if (!settings.last_fm_now_playing) {
		return;
	}

	_sessionID(function (error, sessionID) {
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

function scrobblingHandler(command) {
	switch (command.type) {
		case 'playing':
			_nowPlaying(command.track);
			break;
		case 'scrobble':
			_scrobble(command.track, command.timestamp);
			break;
	}
}
