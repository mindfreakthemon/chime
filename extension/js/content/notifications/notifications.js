'use strict';

define(['player/player', 'settings', 'notifications/display'], function (_player, _settings, _display) {
	var player = _interopRequireWildcard(_player);

	var _settings2 = _interopRequireDefault(_settings);

	var _display2 = _interopRequireDefault(_display);

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

	var logger = getLogger('notifications');

	const NOTIFY_ENABLED = _settings2.default.get('notify_enabled'),
	      NOTIFY_PLAYING = _settings2.default.get('notify_playing'),
	      NOTIFY_RESUMED = _settings2.default.get('notify_resumed'),
	      NOTIFY_SEEKING = _settings2.default.get('notify_seeking'),
	      NOTIFY_PAUSED = _settings2.default.get('notify_paused'),
	      NOTIFY_STOPPED = _settings2.default.get('notify_stopped'),
	      NOTIFY_FINISHED = _settings2.default.get('notify_finished');

	if (NOTIFY_ENABLED) {
		if (NOTIFY_PLAYING) {
			player.onPlaying.addListener(function (track) {
				logger('on playing');
				(0, _display2.default)('play-pause', {
					type: 'basic',
					iconUrl: track.cover,
					title: track.title,
					message: track.artist + ' - ' + track.album
				});
			});
		}

		if (NOTIFY_RESUMED) {
			player.onResumed.addListener(function (track) {
				logger('on resumed');
				(0, _display2.default)('play-pause', {
					type: 'progress',
					iconUrl: track.cover,
					title: track.title,
					message: track.artist + ' - ' + track.album,
					progress: track.progress
				});
			});
		}

		if (NOTIFY_SEEKING) {
			player.onSeeking.addListener(function (track) {
				logger('on seeking');
				(0, _display2.default)('play-pause', {
					type: 'progress',
					iconUrl: track.cover,
					title: track.title,
					message: track.artist + ' - ' + track.album,
					progress: track.progress
				});
			});
		}

		if (NOTIFY_PAUSED) {
			player.onPaused.addListener(function (track) {
				logger('on paused');
				(0, _display2.default)('play-pause', {
					type: 'progress',
					iconUrl: track.cover,
					title: 'Paused: ' + track.title,
					message: track.artist + ' - ' + track.album,
					progress: track.progress
				});
			});
		}

		if (NOTIFY_STOPPED) {
			player.onStopped.addListener(function (track) {
				logger('on stopped');
				(0, _display2.default)('stop', {
					type: 'basic',
					iconUrl: track.cover,
					title: 'Stopped: ' + track.title,
					message: track.artist + ' - ' + track.album
				});
			});
		}

		if (NOTIFY_FINISHED) {
			player.onFinished.addListener(function () {
				logger('on finished');
				(0, _display2.default)('finish', {
					type: 'basic',
					title: 'Playlist has ended!',
					message: 'No more songs to play.'
				});
			});
		}
	}
});
//# sourceMappingURL=notifications.js.map
