(function (global) {
	function lastfmAPISign(params) {
		var keys = Object.keys(params),
			result = '';

		// alphabetical sort
		keys.sort();
		keys.forEach(function (key) {
			if (key == 'format' || key == 'callback')
				return;

			result += key + params[key];
		});

		return MD5(result + Settings.getItem('scrobbling_api_secret'));
	}

	function lastfmGetToken(callback) {
		clearInterval(lastfmGetToken.interval);

		var params = {
				method: 'auth.getToken',
				api_key: Settings.getItem('scrobbling_api_key'),
				format: 'json'
			},
			url = Settings.getItem('scrobbling_api_url') + queryString(params),
			xhr = new XMLHttpRequest();

		xhr.open('GET', url);
		xhr.onload = function () {
			var json = JSON.parse(xhr.responseText);

			if (!json.error) {
				var win = window.open('https://www.last.fm/api/auth/?api_key=' +
					Settings.getItem('scrobbling_api_key') + '&token=' + json.token,
					'lastfm_popup',
					'width=1024,height=475');

				if (callback) {
					lastfmGetToken.interval = setInterval(function () {
						if (win.closed) {
							clearInterval(lastfmGetToken.interval);
							Settings.setItem('scrobbling_token', json.token);
							callback(null, json.token);
						}
					}, 100);
				}
			}
		};

		xhr.send();
	}

	function lastfmGetSessionID(callback) {
		var sessionID = Settings.getItem('scrobbling_sessionID'),
			token = Settings.getItem('scrobbling_token');

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
				api_key: Settings.getItem('scrobbling_api_key'),
				token: token,
				format: 'json'
			},
			url = Settings.getItem('scrobbling_api_url') + queryString(params) + '&api_sig=' + lastfmAPISign(params),
			xhr = new XMLHttpRequest();

		xhr.open('GET', url);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function () {
			var json = JSON.parse(xhr.responseText);

			if (json.error) {
				callback(json.error);
			} else {
				sessionID = json.session.key;
				Settings.setItem('scrobbling_sessionID', sessionID);

				callback(null, sessionID);
			}
		};

		xhr.send();
	}

	global.Scrobbling = {
		session: lastfmGetSessionID,
		authorize: lastfmGetToken,
		sign: lastfmAPISign
	};
})(window);


