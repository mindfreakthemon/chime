'use strict';

define(['player/player', 'player/clock', 'lastfm', 'scrobbling/ui', 'settings'], function (_player, _clock, _lastfm, _ui, _settings) {
	var player = _interopRequireWildcard(_player);

	var clock = _interopRequireWildcard(_clock);

	var lastfm = _interopRequireWildcard(_lastfm);

	var ui = _interopRequireWildcard(_ui);

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

	let logger = getLogger('lastfm');
	let scrobbleTimeout;

	const SCROBBLING_MIN_PERCENT = _settings2.default.get('scrobbling_min_percent'),
	      SCROBBLING_MIN_LENGTH = _settings2.default.get('scrobbling_min_length'),
	      SCROBBLING_NOW_PLAYING = _settings2.default.get('scrobbling_now_playing'),
	      SCROBBLING_ENABLED = _settings2.default.get('scrobbling_enabled');

	function sendScrobble(track) {
		let timestamp = clock.getStartTimestamp();
		logger('going to scrobble this track on stop');
		clearScrobblingTimeout();
		player.onResumed.removeListener(setScrobblingTimeout);
		player.onStopped.addListener(function _handleStopped() {
			player.onStopped.removeListener(_handleStopped);
			lastfm.scrobble(timestamp, track).then(() => logger('scrobbled')).catch(error => logger('scrobbling error:', error));
		});
	}

	function setScrobblingTimeout(track) {
		let halftime = Math.floor(track.duration * SCROBBLING_MIN_PERCENT - clock.getPlayedTime());
		scrobbleTimeout = setTimeout(sendScrobble.bind(null, track), halftime);
	}

	function clearScrobblingTimeout() {
		clearTimeout(scrobbleTimeout);
	}

	if (SCROBBLING_ENABLED) {
		player.onPaused.addListener(clearScrobblingTimeout);
		player.onStopped.addListener(clearScrobblingTimeout);
		player.onPlaying.addListener(track => {
			if (track.duration > SCROBBLING_MIN_LENGTH) {
				setScrobblingTimeout(track);
				player.onResumed.addListener(setScrobblingTimeout);
			}
		});
	}

	if (SCROBBLING_NOW_PLAYING) {
		player.onPlaying.addListener(lastfm.nowPlaying);
		player.onResumed.addListener(lastfm.nowPlaying);
	}

	lastfm.getProfile().then(user => {
		ui.update({
			user: user,
			scrobbling: SCROBBLING_ENABLED,
			nowPlaying: SCROBBLING_NOW_PLAYING
		});
		ui.show();
	});
});
//# sourceMappingURL=scrobbling.js.map
