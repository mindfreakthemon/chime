'use strict';

define(['exports', 'lastfm-core', 'settings'], function (exports, _lastfmCore, _settings) {
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.getProfile = exports.scrobble = exports.nowPlaying = exports.core = undefined;

	var core = _interopRequireWildcard(_lastfmCore);

	var _settings2 = _interopRequireDefault(_settings);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	function _interopRequireWildcard(obj) {
		if (obj && obj.__esModule) {
			return obj;
		} else {
			var newObj = {};

			if (obj != null) {
				for (var key in obj) {
					if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
				}
			}

			newObj.default = obj;
			return newObj;
		}
	}

	function _asyncToGenerator(fn) {
		return function () {
			var gen = fn.apply(this, arguments);
			return new Promise(function (resolve, reject) {
				function step(key, arg) {
					try {
						var info = gen[key](arg);
						var value = info.value;
					} catch (error) {
						reject(error);
						return;
					}

					if (info.done) {
						resolve(value);
					} else {
						Promise.resolve(value).then(function (value) {
							step("next", value);
						}, function (err) {
							step("throw", err);
						});
					}
				}

				step("next");
			});
		};
	}

	exports.core = core;

	let nowPlaying = exports.nowPlaying = (function () {
		var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(track) {
			var sessionID, params, api_sig, url;
			return regeneratorRuntime.wrap(function _callee$(_context) {
				while (1) switch (_context.prev = _context.next) {
					case 0:
						_context.next = 2;
						return core.session();

					case 2:
						sessionID = _context.sent;
						params = {
							method: 'track.updateNowPlaying',
							track: track.title,
							artist: track.artist,
							album: track.album,
							duration: Math.ceil(track.duration / 1000),
							api_key: _settings2.default.get('scrobbling_api_key'),
							sk: sessionID,
							format: 'json'
						}, api_sig = core.sign(params), url = _settings2.default.get('scrobbling_api_url');
						return _context.abrupt('return', fetch(url, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'
							},
							body: queryString(params) + '&api_sig=' + api_sig
						}));

					case 5:
					case 'end':
						return _context.stop();
				}
			}, _callee, this);
		}));

		return function nowPlaying(_x) {
			return ref.apply(this, arguments);
		};
	})();

	let scrobble = exports.scrobble = (function () {
		var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(timestamp, track) {
			var sessionID, params, api_sig, url;
			return regeneratorRuntime.wrap(function _callee2$(_context2) {
				while (1) switch (_context2.prev = _context2.next) {
					case 0:
						_context2.next = 2;
						return core.session();

					case 2:
						sessionID = _context2.sent;
						params = {
							method: 'track.scrobble',
							timestamp: Math.floor(timestamp / 1000),
							track: track.title,
							artist: track.artist,
							album: track.album,
							api_key: _settings2.default.get('scrobbling_api_key'),
							sk: sessionID,
							format: 'json'
						}, api_sig = core.sign(params), url = _settings2.default.get('scrobbling_api_url');
						return _context2.abrupt('return', fetch(url, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'
							},
							body: queryString(params) + '&api_sig=' + api_sig
						}));

					case 5:
					case 'end':
						return _context2.stop();
				}
			}, _callee2, this);
		}));

		return function scrobble(_x2, _x3) {
			return ref.apply(this, arguments);
		};
	})();

	let getProfile = exports.getProfile = (function () {
		var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
			var sessionID, params, api_sig, url, json;
			return regeneratorRuntime.wrap(function _callee3$(_context3) {
				while (1) switch (_context3.prev = _context3.next) {
					case 0:
						_context3.next = 2;
						return core.session();

					case 2:
						sessionID = _context3.sent;
						params = {
							method: 'user.getInfo',
							api_key: _settings2.default.get('scrobbling_api_key'),
							sk: sessionID,
							format: 'json'
						}, api_sig = core.sign(params), url = _settings2.default.get('scrobbling_api_url') + queryString(params) + '&api_sig=' + api_sig;
						_context3.next = 6;
						return fetch(url).then(response => response.json());

					case 6:
						json = _context3.sent;

						if (!json.error) {
							_context3.next = 9;
							break;
						}

						return _context3.abrupt('return', Promise.reject(json.error));

					case 9:
						return _context3.abrupt('return', json.user);

					case 10:
					case 'end':
						return _context3.stop();
				}
			}, _callee3, this);
		}));

		return function getProfile() {
			return ref.apply(this, arguments);
		};
	})();
});
//# sourceMappingURL=api.js.map
