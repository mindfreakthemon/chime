import * as player from 'player/player.js';
import settings from 'settings.js';
import display from 'notifications/display.js';

var logger = getLogger('notifications');

const NOTIFY_ENABLED = settings.get('notify_enabled'),
	NOTIFY_PLAYING = settings.get('notify_playing'),
	NOTIFY_RESUMED = settings.get('notify_resumed'),
	NOTIFY_SEEKING = settings.get('notify_seeking'),
	NOTIFY_PAUSED = settings.get('notify_paused'),
	NOTIFY_STOPPED = settings.get('notify_stopped'),
	NOTIFY_FINISHED = settings.get('notify_finished');

if (NOTIFY_ENABLED) {
	if (NOTIFY_PLAYING) {
		player.onPlaying.addListener(function (track) {
			logger('on playing');

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
			logger('on resumed');

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
			logger('on seeking');

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
			logger('on paused');

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
			logger('on stopped');

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
			logger('on finished');

			display('finish', {
				type: 'basic',
				title: 'Playlist has ended!',
				message: 'No more songs to play.'
			});
		});
	}
}
