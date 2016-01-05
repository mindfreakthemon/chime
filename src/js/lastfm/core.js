import md5 from 'md5';
import settings from 'settings.js';

export function sign(params) {
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

export function authorize(callback) {
	clearInterval(authorize.interval);

	var params = {
			method: 'auth.getToken',
			api_key: settings.get('scrobbling_api_key'),
			format: 'json'
		},
		url = settings.get('scrobbling_api_url') + queryString(params);

	return fetch(url)
		.then((response) => response.json())
		.then((json) => {
			if (json.error) {
				throw json.error;
			}

			var win = window.open('https://www.last.fm/api/auth/?api_key=' +
				settings.get('scrobbling_api_key') + '&token=' + json.token,
				'lastfm_popup',
				'width=1024,height=475');

			if (callback) {
				authorize.interval = setInterval(function () {
					if (win.closed) {
						clearInterval(authorize.interval);
						console.log(json.token);
						settings.set('scrobbling_token', json.token);
						callback(null, json.token);
					}
				}, 100);
			}
		})
		.catch(callback);
}

export function session() {
	var sessionID = settings.get('scrobbling_sessionID'),
		token = settings.get('scrobbling_token');

	if (!token) {
		// do nothing
		return Promise.reject('no token');
	}

	if (sessionID) {
		// already got session key
		return Promise.resolve(sessionID);
	}

	var params = {
			method: 'auth.getsession',
			api_key: settings.get('scrobbling_api_key'),
			token: token,
			format: 'json'
		},
		url = settings.get('scrobbling_api_url') + queryString(params) + '&api_sig=' + sign(params);

	return fetch(url)
		.then((response) => response.json())
		.then((json) => {
			if (json.error) {
				throw json.error;
			}

			settings.set('scrobbling_sessionID', json.session.key);

			return json.session.key;
		});
}
