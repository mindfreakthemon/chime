Settings.promise.then(function () {
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

		if (!Settings.getItem('scrobbling_enabled')) {
			logger('scrobbling is disabled');
			return;
		}

		if (Settings.getItem('scrobbling_notify')) {
			logger('notifying about scrobbling');
			notify('Scrobbled: ' + track.title, track.artist + ' - ' + track.album, track.cover);
		}

		bindEvent('chime-stopped', function _handleStopped() {
			// only once
			unbindEvent('chime-stopped', _handleStopped);

			Scrobbling.session(function (error, sessionID) {
				if (error) {
					logger('scrobbling error:', error, track);
					return;
				}

				logger('scrobbling:', track);

				var params = {
						method: 'track.scrobble',
						timestamp: Math.floor(e.detail.playingTimestamp / 1000),
						track: track.title,
						artist: track.artist,
						album: track.album,
						api_key: Settings.getItem('scrobbling_api_key'),
						sk: sessionID,
						format: 'json'
					},
					api_sig = Scrobbling.sign(params),
					url = Settings.getItem('scrobbling_api_url'),
					xhr = new XMLHttpRequest();

				xhr.open('POST', url);
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhr.send(queryString(params) + '&api_sig=' + api_sig);
			});
		});
	}

	bindEvent('chime-playing chime-resumed', function (e) {
		var track = e.detail.playingTrack;

		if (!Settings.getItem('scrobbling_now_playing')) {
			logger('now.playing is disabled');
			return;
		}

		Scrobbling.session(function (error, sessionID) {
			if (error) {
				logger('now.playing error:', error, track);
				return;
			}

			logger('now.playing:', track);

			var params = {
					method: 'track.updateNowPlaying',
					track: track.title,
					artist: track.artist,
					album: track.album,
					duration: Math.ceil(track.duration / 1000),
					api_key: Settings.getItem('scrobbling_api_key'),
					sk: sessionID,
					format: 'json'
				},
				api_sig = Scrobbling.sign(params),
				url = Settings.getItem('scrobbling_api_url'),
				xhr = new XMLHttpRequest();

			xhr.open('POST', url);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(queryString(params) + '&api_sig=' + api_sig);
		});
	});

	bindEvent('chime-resumed', function (e) {
		var track = e.detail.playingTrack;

		if (!scrobbledFlag) {
			scrobbleTimeout = setTimeout(sendScrobble.bind(null, e),
				Math.floor(track.duration * scrobblePercent - e.detail.playedTime));
		}
	});

	bindEvent('chime-playing', function (e) {
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

	bindEvent('chime-stopped', function (e) {
		clearTimeout(scrobbleTimeout);
		scrobbleTimeout = null;
		scrobbledFlag = false;
	});
});
