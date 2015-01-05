define(['player/player', 'settings', 'notifications/display'], function (player, settings, display) {
	var logger = getLogger('notifications');

	player.onPlaying.addListener(function (data) {
		var track = data.playingTrack;

		if (settings.get('notify_playing')) {
			logger('on playing');

			display('play-pause', {
				type: 'basic',
				iconUrl: track.cover,
				title: track.title,
				message: track.artist + ' - ' + track.album
			});
		}
	});

	player.onResumed.addListener(function (data) {
		var track = data.playingTrack;

		if (settings.get('notify_resumed')) {
			logger('on resumed');

			display('play-pause', {
				type: 'progress',
				iconUrl: track.cover,
				title: track.title,
				message: track.artist + ' - ' + track.album,
				progress: Math.round(100 * track.position / track.duration)
			});
		}
	});

	player.onSeeking.addListener(function (data) {
		var track = data.playingTrack;

		if (settings.get('notify_seeking')) {
			logger('on seeking');

			display('play-pause', {
				type: 'progress',
				iconUrl: track.cover,
				title: track.title,
				message: track.artist + ' - ' + track.album,
				progress: Math.round(100 * track.position / track.duration)
			});
		}
	});

	player.onPaused.addListener(function (data) {
		var track = data.playingTrack;

		if (settings.get('notify_paused')) {
			logger('on paused');

			display('play-pause', {
				type: 'progress',
				iconUrl: track.cover,
				title: 'Paused: ' + track.title,
				message: track.artist + ' - ' + track.album,
				progress: Math.round(100 * track.position / track.duration)
			});
		}
	});

	player.onStopped.addListener(function (data) {
		var track = data.playingTrack;

		if (settings.get('notify_stopped')) {
			logger('on stopped');

			display('stop', {
				type: 'basic',
				iconUrl: track.cover,
				title: 'Stopped: ' + track.title,
				message: track.artist + ' - ' + track.album
			});
		}
	});

	player.onFinished.addListener(function () {
		if (settings.get('notify_finished')) {
			logger('on finished');

			display('finish', {
				type: 'basic',
				title: 'Playlist has ended!',
				message: 'No more songs to play.'
			});
		}
	});
});
