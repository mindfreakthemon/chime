import * as player from 'content/player/player.js';
import * as clock from 'content/player/clock.js';
import * as lastfm from 'lastfm/api.js';
import * as ui from 'content/scrobbling/ui.js';
import storage from 'utils/storage.js';
import * as logger from 'utils/logger.js';

let scrobbleTimeout;

const SCROBBLING_MIN_PERCENT = storage.get('scrobbling_min_percent'),
	SCROBBLING_MIN_LENGTH = storage.get('scrobbling_min_length'),
	SCROBBLING_NOW_PLAYING = storage.get('scrobbling_now_playing'),
	SCROBBLING_ENABLED = storage.get('scrobbling_enabled');

function sendScrobble(track) {
	let timestamp = clock.getStartTimestamp();

	logger.info('going to scrobble this track on stop');

	clearScrobblingTimeout();
	player.onResumed.removeListener(setScrobblingTimeout);

	player.onStopped.addListener(function _handleStopped() {
		// only once
		player.onStopped.removeListener(_handleStopped);

		lastfm.scrobble(timestamp, track)
			.then(() => logger.info('scrobbled'))
			.catch((error) => logger.info('scrobbling error:', error));
	});
}

function setScrobblingTimeout(track) {
	let halftime = Math.floor(track.duration * SCROBBLING_MIN_PERCENT - clock.getPlayedTime());

	scrobbleTimeout = setTimeout(sendScrobble.bind(null, track), halftime);
}

function clearScrobblingTimeout() {
	clearTimeout(scrobbleTimeout);
}

player.onPaused.addListener(clearScrobblingTimeout);
player.onStopped.addListener(clearScrobblingTimeout);

player.onPlaying.addListener((track) => {
	if (track.duration > SCROBBLING_MIN_LENGTH) {
		setScrobblingTimeout(track);
		player.onResumed.addListener(setScrobblingTimeout);
	}
});

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
