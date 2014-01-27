Settings.promise.then(function () {
	var logger = getLogger('notifications');

	bindEvent('chime-playing', function (e) {
		var track = e.detail.playingTrack;

		if (Settings.getItem('notify_playing')) {
			logger(e.type, e);
			notify(track.title, track.artist + ' - ' + track.album, track.cover);
		}
	});

	bindEvent('chime-resumed', function (e) {
		var track = e.detail.playingTrack;

		if (Settings.getItem('notify_resumed')) {
			logger(e.type, e);
			notify(track.title, track.artist + ' - ' + track.album, track.cover);
		}
	});

	bindEvent('chime-paused', function (e) {
		var track = e.detail.playingTrack;

		if (Settings.getItem('notify_paused')) {
			logger(e.type, e);
			notify('Paused: ' + track.title, track.artist + ' - ' + track.album, track.cover);
		}
	});

	bindEvent('chime-stopped', function (e) {
		var track = e.detail.playingTrack;

		if (Settings.getItem('notify_stopped')) {
			logger(e.type, e);
			notify('Stopped: ' + track.title, track.artist + ' - ' + track.album, track.cover);
		}
	});

	bindEvent('chime-finished', function (e) {
		if (Settings.getItem('notify_finished')) {
			logger(e.type, e);
			notify('Playlist has ended', 'No more songs to play.');
		}
	});
});
