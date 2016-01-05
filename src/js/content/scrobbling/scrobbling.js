import * as player from 'player/player.js';
import * as clock from 'player/clock.js';
import * as lastfm from 'lastfm.js';
import * as ui from 'scrobbling/ui.js';
import settings from 'settings.js';

let logger = getLogger('lastfm');

let scrobbleTimeout;

const SCROBBLING_MIN_PERCENT = settings.get('scrobbling_min_percent'),
	SCROBBLING_MIN_LENGTH = settings.get('scrobbling_min_length'),
	SCROBBLING_NOW_PLAYING = settings.get('scrobbling_now_playing'),
	SCROBBLING_ENABLED = settings.get('scrobbling_enabled');

function sendScrobble(track) {
	let timestamp = clock.getStartTimestamp();

	logger('going to scrobble this track on stop');

	clearScrobblingTimeout();
	player.onResumed.removeListener(setScrobblingTimeout);

	player.onStopped.addListener(function _handleStopped() {
		// only once
		player.onStopped.removeListener(_handleStopped);

		lastfm.scrobble(timestamp, track)
			.then(() => logger('scrobbled'))
			.catch((error) => logger('scrobbling error:', error));
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

	player.onPlaying.addListener((track) => {
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

lastfm.getProfile()
	.then((user) => {
		ui.update({
			user: user,
			scrobbling: SCROBBLING_ENABLED,
			nowPlaying: SCROBBLING_NOW_PLAYING
		});

		ui.show();
	});
