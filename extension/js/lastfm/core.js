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
		xhr.timeout = 10000;
		xhr.onerror = xhr.ontimeout = function () {
			callback(true);
		};
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

	function session() {
		return new Promise(function (fullfil, reject) {
			var sessionID = settings.get('scrobbling_sessionID'),
				token = settings.get('scrobbling_token');

			if (!token) {
				// do nothing
				reject('no token');
				return;
			}

			if (sessionID) {
				// already got session key
				fullfil(sessionID);
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
			xhr.timeout = 10000;
			xhr.onerror = xhr.ontimeout = function () {
				reject('timeout');
			};
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.onload = function () {
				var json = JSON.parse(xhr.responseText);

				if (json.error) {
					reject(json.error);
				} else {
					sessionID = json.session.key;
					settings.set('scrobbling_sessionID', sessionID);

					fullfil(sessionID);
				}
			};

			xhr.send();
		});
	}

	return {
		// core
		session: session,
		authorize: authorize,
		sign: sign
	};
});


