define(['events', 'settings', 'notifications/display'], function (events, settings, display) {
	var logger = getLogger('notifications');

	events.addEventListener('chime-playing', function (e) {
		var track = e.detail.playingTrack;

		if (settings.get('notify_playing')) {
			logger(e.type, e);

			display('play-pause', {
				type: 'basic',
				iconUrl: track.cover,
				title: track.title,
				message: track.artist + ' - ' + track.album
			});
		}
	});

	events.addEventListener('chime-resumed', function (e) {
		var track = e.detail.playingTrack;

		if (settings.get('notify_resumed')) {
			logger(e.type, e);

			display('play-pause', {
				type: 'progress',
				iconUrl: track.cover,
				title: track.title,
				message: track.artist + ' - ' + track.album,
				progress: Math.round(100 * track.position / track.duration)
			});
		}
	});

	events.addEventListener('chime-seeking', function (e) {
		var track = e.detail.playingTrack;

		if (settings.get('notify_seeking')) {
			logger(e.type, e);

			display('play-pause', {
				type: 'progress',
				iconUrl: track.cover,
				title: track.title,
				message: track.artist + ' - ' + track.album,
				progress: Math.round(100 * track.position / track.duration)
			});
		}
	});

	events.addEventListener('chime-paused', function (e) {
		var track = e.detail.playingTrack;

		if (settings.get('notify_paused')) {
			logger(e.type, e);

			display('play-pause', {
				type: 'progress',
				iconUrl: track.cover,
				title: 'Paused: ' + track.title,
				message: track.artist + ' - ' + track.album,
				progress: Math.round(100 * track.position / track.duration)
			});
		}
	});

	events.addEventListener('chime-stopped', function (e) {
		var track = e.detail.playingTrack;

		if (settings.get('notify_stopped')) {
			logger(e.type, e);

			display('stop', {
				type: 'basic',
				iconUrl: track.cover,
				title: 'Stopped: ' + track.title,
				message: track.artist + ' - ' + track.album
			});
		}
	});

	events.addEventListener('chime-finished', function (e) {
		if (settings.get('notify_finished')) {
			logger(e.type, e);

			display('finish', {
				type: 'basic',
				title: 'Playlist has ended!',
				message: 'No more songs to play.'
			});
		}
	});
});
