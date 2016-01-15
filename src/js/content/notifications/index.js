import * as player from 'content/player/player.js';
import storage from 'utils/storage.js';
import display from 'content/notifications/display.js';
import * as logger from 'utils/logger.js';

const NOTIFY_PLAYING = storage.get('notify_playing'),
	NOTIFY_RESUMED = storage.get('notify_resumed'),
	NOTIFY_SEEKING = storage.get('notify_seeking'),
	NOTIFY_PAUSED = storage.get('notify_paused'),
	NOTIFY_STOPPED = storage.get('notify_stopped'),
	NOTIFY_FINISHED = storage.get('notify_finished');

if (NOTIFY_PLAYING) {
	player.onPlaying.addListener(function (track) {
		logger.info('on playing');

		display('play-pause', {
			type: 'basic',
			iconUrl: track.cover,
			title: track.title,
			message: track.artist + ' - ' + track.album
		});
	});
}

if (NOTIFY_RESUMED) {
	player.onResumed.addListener(function (track) {
		logger.info('on resumed');

		display('play-pause', {
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
		logger.info('on seeking');

		display('play-pause', {
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
		logger.info('on paused');

		display('play-pause', {
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
		logger.info('on stopped');

		display('stop', {
			type: 'basic',
			iconUrl: track.cover,
			title: 'Stopped: ' + track.title,
			message: track.artist + ' - ' + track.album
		});
	});
}

if (NOTIFY_FINISHED) {
	player.onFinished.addListener(function () {
		logger.info('on finished');

		display('finish', {
			type: 'basic',
			title: 'Playlist has ended!',
			message: 'No more songs to play.'
		});
	});
}
