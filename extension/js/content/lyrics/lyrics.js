'use strict';

define(['player/player', 'settings', 'lyrics/ui', 'lyrics/loader', 'track/track.factory'], function (_player, _settings, _ui, _loader, _track) {
	var player = _interopRequireWildcard(_player);

	var _settings2 = _interopRequireDefault(_settings);

	var _ui2 = _interopRequireDefault(_ui);

	var _loader2 = _interopRequireDefault(_loader);

	var _track2 = _interopRequireDefault(_track);

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

	var logger = getLogger('lyrics'),
	    providers = [],
	    providersOrigins = [];

	function fillProviders() {
		logger('providers list was updated');
		providers = _settings2.default.get('lyrics_providers');
		providers.forEach(function (provider) {
			providersOrigins.push('http://*.' + provider[0] + '/*', 'https://*.' + provider[0] + '/*');
		});
	}

	let callLoader = (function () {
		var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
			var data;
			return regeneratorRuntime.wrap(function _callee$(_context) {
				while (1) switch (_context.prev = _context.next) {
					case 0:
						_ui2.default.clearLyrics();
						_ui2.default.showLoading();

						_context.prev = 2;
						_context.next = 5;
						return (0, _loader2.default)(_track2.default.extract());

					case 5:
						data = _context.sent;

						_ui2.default.setLyrics(data);
						_ui2.default.showLyrics();
						_context.next = 13;
						break;

					case 10:
						_context.prev = 10;
						_context.t0 = _context['catch'](2);

						_ui2.default.showError();

					case 13:
					case 'end':
						return _context.stop();
				}
			}, _callee, this, [[2, 10]]);
		}));

		return function callLoader() {
			return ref.apply(this, arguments);
		};
	})();

	fillProviders();

	_ui2.default.button.addEventListener('click', function () {
		var enabled = _ui2.default.isShown();

		logger('clicked on lyrics link. is enabled: %s', enabled);

		if (enabled) {
			_ui2.default.toggleShown();

			return;
		}

		chrome.runtime.sendMessage({
			permissions: {
				origins: providersOrigins
			},
			type: 'request'
		}, function (granted) {
			if (!granted) {
				logger('permission not granted');
				return;
			}

			_ui2.default.toggleShown();

			callLoader();
		});
	});

	window.addEventListener('beforeunload', function () {
		chrome.runtime.sendMessage({
			permissions: {
				origins: providersOrigins
			},
			type: 'remove'
		}, function (removed) {
			logger('lyrics permissions removed: %s', removed);
		});
	});

	_ui2.default.toggle(_settings2.default.get('lyrics_enabled'));

	player.onPlaying.addListener(function () {
		if (_ui2.default.isShown()) {
			callLoader();
		}
	});
});
//# sourceMappingURL=lyrics.js.map
