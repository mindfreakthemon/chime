'use strict';

define(['exports', 'md5', 'settings'], function (exports, _md, _settings) {
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.sign = sign;
	exports.authorize = authorize;
	exports.session = session;

	var _md2 = _interopRequireDefault(_md);

	var _settings2 = _interopRequireDefault(_settings);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	function sign(params) {
		var keys = Object.keys(params),
		    result = '';
		keys.sort();
		keys.forEach(function (key) {
			if (key == 'format' || key == 'callback') return;
			result += key + params[key];
		});
		return (0, _md2.default)(result + _settings2.default.get('scrobbling_api_secret'));
	}

	function authorize(callback) {
		clearInterval(authorize.interval);
		var params = {
			method: 'auth.getToken',
			api_key: _settings2.default.get('scrobbling_api_key'),
			format: 'json'
		},
		    url = _settings2.default.get('scrobbling_api_url') + queryString(params);
		return fetch(url).then(response => response.json()).then(json => {
			if (json.error) {
				throw json.error;
			}

			var win = window.open('https://www.last.fm/api/auth/?api_key=' + _settings2.default.get('scrobbling_api_key') + '&token=' + json.token, 'lastfm_popup', 'width=1024,height=475');

			if (callback) {
				authorize.interval = setInterval(function () {
					if (win.closed) {
						clearInterval(authorize.interval);
						console.log(json.token);

						_settings2.default.set('scrobbling_token', json.token);

						callback(null, json.token);
					}
				}, 100);
			}
		}).catch(callback);
	}

	function session() {
		var sessionID = _settings2.default.get('scrobbling_sessionID'),
		    token = _settings2.default.get('scrobbling_token');

		if (!token) {
			return Promise.reject('no token');
		}

		if (sessionID) {
			return Promise.resolve(sessionID);
		}

		var params = {
			method: 'auth.getsession',
			api_key: _settings2.default.get('scrobbling_api_key'),
			token: token,
			format: 'json'
		},
		    url = _settings2.default.get('scrobbling_api_url') + queryString(params) + '&api_sig=' + sign(params);
		return fetch(url).then(response => response.json()).then(json => {
			if (json.error) {
				throw json.error;
			}

			_settings2.default.set('scrobbling_sessionID', json.session.key);

			return json.session.key;
		});
	}
});
//# sourceMappingURL=core.js.map
