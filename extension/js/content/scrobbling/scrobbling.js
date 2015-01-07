define(['player/player', 'lastfm', 'settings', 'scrobbling/ui'], function (player, lastfm, settings, ui) {
	var logger = getLogger('lastfm');

	var scrobbleUser = null;

	var scrobbleTimeout,
		scrobbledFlag = false;

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

			lastfm.scrobble(data.playingTimestamp, track)
				.then(function () {
					logger('scrobbling');
				}, function (error) {
					logger('scrobbling error:', error);
				});
		});
	}

	player.onPaused.addListener(function () {
		if (scrobbleTimeout) {
			clearTimeout(scrobbleTimeout);
		}
	});

	player.onResumed.addListener(function (data) {
		var track = data.playingTrack;

		if (!scrobbledFlag) {
			scrobbleTimeout = setTimeout(sendScrobble.bind(null, data),
				Math.floor(track.duration * settings.get('scrobbling_min_percent') - data.playedTime));
		}
	});

	player.onPlaying.addListener(function (data) {
		var track = data.playingTrack;

		if (track.duration > settings.get('scrobbling_min_length')) {
			scrobbledFlag = false;
			scrobbleTimeout = setTimeout(sendScrobble.bind(null, data),
				Math.floor(track.duration * settings.get('scrobbling_min_percent')));
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

	/* now playing */
	function onGoing(data) {
		var track = data.playingTrack;

		if (!settings.get('scrobbling_now_playing')) {
			logger('now.playing is disabled');
			return;
		}

		lastfm.nowPlaying(track)
			.then(function () {
				logger('now.playing sent');
			}, function (error) {
				logger('now.playing error:', error);
			});
	}

	player.onPlaying.addListener(onGoing);
	player.onResumed.addListener(onGoing);

	function updateUser() {
		lastfm.getProfile().then(function (user) {
			scrobbleUser = user;
			updateUI();
		}, function () {
			scrobbleUser = null;
			updateUI();
		});
	}

	function updateUI() {
		ui.update({
			user: scrobbleUser,
			scrobbling: settings.get('scrobbling_enabled'),
			nowPlaying: settings.get('scrobbling_now_playing'),
			scrobbled: scrobbledFlag
		});

		ui.toggle(!!scrobbleUser);
	}

	settings.onUpdate.addListener(function (changes) {
		if (changes.scrobbling_sessionID) {
			updateUser();
		} else if (changes.scrobbling_enabled || changes.scrobbling_now_playing) {
			updateUI();
		}
	});

	updateUser();
});
