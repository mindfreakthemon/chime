define(['player/player', 'lastfm', 'settings'], function (player, lastfm, settings) {
	var logger = getLogger('lastfm');

	var scrobbleTimeout,
		scrobbledFlag = false,
		scrobbleMinDuration = settings.get('scrobbling_min_length'),
		scrobblePercent = settings.get('scrobbling_min_percent');

	function sendScrobble(data) {
		var track = data.playingTrack;

		if (!settings.get('scrobbling_enabled')) {
			logger('scrobbling is disabled');
			return;
		}

		if (scrobbledFlag) {
			// if already scrobbled
			logger('already scrobbled');
			return;
		}

		scrobbledFlag = true;

		logger('going to scrobble this track on stop');

		player.onStopped.addListener(function _handleStopped() {
			// only once
			player.onStopped.removeListener(_handleStopped);

			lastfm.scrobble(data.playingTimestamp, track, function (error) {
				if (error) {
					logger('scrobbling error:', error);
					return;
				}

				logger('scrobbling');
			});
		})
	}

	function onGoing(data) {
		var track = data.playingTrack;

		if (!settings.get('scrobbling_now_playing')) {
			logger('now.playing is disabled');
			return;
		}

		lastfm.nowPlaying(track, function (error) {
			if (error) {
				logger('now.playing error:', error);
				return;
			}

			logger('now.playing sent');
		});
	}

	player.onPlaying.addListener(onGoing);
	player.onResumed.addListener(onGoing);

	player.onResumed.addListener(function (data) {
		var track = data.playingTrack;

		if (!scrobbledFlag) {
			scrobbleTimeout = setTimeout(sendScrobble.bind(null, data),
				Math.floor(track.duration * scrobblePercent - data.playedTime));
		}
	});

	player.onPlaying.addListener(function (data) {
		var track = data.playingTrack;

		if (track.duration > scrobbleMinDuration) {
			scrobbledFlag = false;
			scrobbleTimeout = setTimeout(sendScrobble.bind(null, data),
				Math.floor(track.duration  * scrobblePercent));
		} else {
			logger('scrobbling: track too small');

			// track is too small to scrobble it
			scrobbledFlag = true;
		}
	});

	player.onStopped.addListener(function () {
		clearTimeout(scrobbleTimeout);
		scrobbleTimeout = null;
		scrobbledFlag = false;
	});
});
