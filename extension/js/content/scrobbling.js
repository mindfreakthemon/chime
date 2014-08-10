define(['player', 'events', 'lastfm', 'settings'], function (player, events, lastfm, settings) {
	var logger = getLogger('lastfm');

	var scrobbleTimeout,
		scrobbledFlag = false,
		scrobbleMinDuration = 30000, // 30 sec
		scrobblePercent = 0.5; // on half duration

	function sendScrobble(e) {
		var track = e.detail.playingTrack;

		if (scrobbledFlag) {
			// if already scrobbled
			logger('already scrobbled');
			return;
		}

		scrobbledFlag = true;

		if (!settings.get('scrobbling_enabled')) {
			logger('scrobbling is disabled');
			return;
		}

		if (settings.get('scrobbling_notify')) {
			logger('notifying about scrobbling');
//			notify('Scrobbled: ' + track.title, track.artist + ' - ' + track.album, track.cover);
		}

		events.addEventListener('chime-stopped', function _handleStopped() {
			// only once
			events.removeEventListener('chime-stopped', _handleStopped);

			lastfm.scrobble(e.detail.playingTimestamp, track, function (error) {
				if (error) {
					logger('scrobbling error:', error, track);
					return;
				}

				logger('scrobbling:', track);
			});
		});
	}

	events.addEventListener('chime-playing chime-resumed', function (e) {
		var track = e.detail.playingTrack;

		if (!settings.get('scrobbling_now_playing')) {
			logger('now.playing is disabled');
			return;
		}

		lastfm.nowPlaying(track, function (error) {
			if (error) {
				logger('now.playing error:', error, track);
				return;
			}

			logger('now.playing:', track);
		});
	});

	events.addEventListener('chime-resumed', function (e) {
		var track = e.detail.playingTrack;

		if (!scrobbledFlag) {
			scrobbleTimeout = setTimeout(sendScrobble.bind(null, e),
				Math.floor(track.duration * scrobblePercent - e.detail.playedTime));
		}
	});

	events.addEventListener('chime-playing', function (e) {
		var track = e.detail.playingTrack;

		if (track.duration > scrobbleMinDuration) {
			scrobbledFlag = false;
			scrobbleTimeout = setTimeout(sendScrobble.bind(null, e),
				Math.floor(track.duration  * scrobblePercent));
		} else {
			// track is too small to scrobble it
			scrobbledFlag = true;
		}
	});

	events.addEventListener('chime-stopped', function (e) {
		clearTimeout(scrobbleTimeout);
		scrobbleTimeout = null;
		scrobbledFlag = false;
	});
});
