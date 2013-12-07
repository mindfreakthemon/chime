function notificationHandler(command) {
	var track = command.track;

	switch (command.type) {
		case 'playing':
			if (settings.notify_playing) {
				notify(track.title, track.artist + ' - ' + track.album, track.cover);
			}

			break;
		case 'playing-started':
			if (!settings.notify_playing && settings.notify_playing_once) {
				notify(track.title, track.artist + ' - ' + track.album, track.cover);
			}

			break;
		case 'paused':
			if (settings.notify_paused) {
				notify('Paused: ' + track.title, track.artist + ' - ' + track.album, track.cover);
			}

			break;
		case 'stopped':
			notify('Chime for Google Music Web Player', 'Stopped');
			break;
	}
}
