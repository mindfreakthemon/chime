import md5 from 'md5';
import storage from 'utils/storage';
import * as querystring from 'utils/querystring';

export function sign(params) {
	let keys = Object.keys(params),
		result = '';

	// alphabetical sort
	keys.sort();
	keys.forEach(function (key) {
		if (key === 'format' || key === 'callback') {
			return;
		}

		result += key + params[key];
	});

	return md5(result + storage.get('scrobbling_api_secret'));
}

export let interval = null;

export function authorize(callback) {
	clearInterval(interval);

	let params = {
		method: 'auth.getToken',
		api_key: storage.get('scrobbling_api_key'),
		format: 'json'
	};

	let url = storage.get('scrobbling_api_url') + querystring.stringify(params);

	return fetch(url)
		.then(response => response.json())
		.then((json) => {
			if (json.error) {
				throw json.error;
			}

			let win = window.open('https://www.last.fm/api/auth/?api_key=' +
				storage.get('scrobbling_api_key') + '&token=' + json.token,
				'lastfm_popup',
				'width=1024,height=475');

			if (callback) {
				interval = setInterval(() => {
					if (win.closed) {
						clearInterval(interval);
						console.log(json.token);
						storage.set('scrobbling_token', json.token);
						callback(null, json.token);
					}
				}, 100);
			}
		})
		.catch(callback);
}

export interface ScrobblingResponse {
	error: string;
}

export interface ScrobblingAuthGetSessionResponse extends ScrobblingResponse {
	session: {
		key: string;
	};
}

export function session() {
	let sessionID = storage.get('scrobbling_sessionID'),
		token = storage.get('scrobbling_token');

	if (!token) {
		return Promise.reject('no token');
	}

	if (sessionID) {
		return Promise.resolve(sessionID);
	}

	let params = {
		method: 'auth.getsession',
		api_key: storage.get('scrobbling_api_key'),
		token: token,
		format: 'json'
	};

	let url = storage.get('scrobbling_api_url') + querystring.stringify(params) + '&api_sig=' + sign(params);

	return fetch(url)
		.then(response => response.json())
		.then((json: ScrobblingAuthGetSessionResponse) => {
			if (json.error) {
				throw json.error;
			}

			storage.set('scrobbling_sessionID', json.session.key);

			return json.session.key;
		});
}
